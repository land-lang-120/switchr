/**
 * Switchr — service auth local (pas de backend obligatoire).
 *
 * Comptes stockes en localStorage avec passwordHash PBKDF2 (jamais en clair).
 * Session = simple flag + uid courant en localStorage.
 *
 * Pour switcher vers Firebase Auth plus tard, ce service expose la meme API
 * (signup, login, logout, currentUser) et le reste de l'app n'a pas a changer.
 */

import { LS_KEYS } from '../config';
import type { LoginInput, SignupInput, User } from '../types/user';
import { LoginSchema, SignupSchema, emptyProfile } from '../types/user';
import { lsGet, lsSet } from './storage';
import { constantTimeEqual, hashPassword } from '../utils/crypto';

const USERS_KEY = 'switchr_users';

interface SessionState {
  readonly uid: string | null;
}

function getUsers(): User[] { return lsGet<User[]>(USERS_KEY, []); }
function setUsers(list: User[]): void { lsSet(USERS_KEY, list); }

function getSession(): SessionState { return lsGet<SessionState>(LS_KEYS.session, { uid: null }); }
function setSession(s: SessionState): void { lsSet(LS_KEYS.session, s); }

/** Recupere l'utilisateur courant (ou null). */
export function currentUser(): User | null {
  const { uid } = getSession();
  if (!uid) return null;
  return getUsers().find((u) => u.uid === uid) ?? null;
}

/** Cree un nouveau compte. Throws Zod si validation echoue, ou {code:'name-taken'}. */
export async function signup(input: SignupInput): Promise<User> {
  const parsed = SignupSchema.parse(input);

  const users = getUsers();
  const nameLower = parsed.fullName.toLowerCase();
  if (users.some((u) => u.fullName.toLowerCase() === nameLower)) {
    const err = new Error('Ce nom est deja pris.');
    (err as Error & { code?: string }).code = 'name-taken';
    throw err;
  }

  const { hashB64, saltB64 } = await hashPassword(parsed.password);
  const now = Date.now();
  const user: User = {
    uid: 'u_' + now.toString(36) + '_' + Math.random().toString(36).slice(2, 8),
    fullName: parsed.fullName,
    email: parsed.email,
    passwordHash: hashB64,
    passwordSalt: saltB64,
    twoFactor: { enabled: false, method: null, secretEncrypted: null, phoneE164: null },
    profile: emptyProfile(),
    createdAtMs: now,
    lastLoginMs: now,
    plan: 'free',
    planExpiresAtMs: 0,
    language: navigator.language?.slice(0, 2) ?? 'fr',
  };

  setUsers([...users, user]);
  setSession({ uid: user.uid });
  lsSet(LS_KEYS.onboarded, true);
  return user;
}

/** Connecte un utilisateur existant. Throws si nom inconnu ou mdp invalide. */
export async function login(input: LoginInput): Promise<User> {
  const parsed = LoginSchema.parse(input);
  const users = getUsers();
  const nameLower = parsed.fullName.toLowerCase();
  const user = users.find((u) => u.fullName.toLowerCase() === nameLower);
  if (!user) {
    const err = new Error('Identifiants invalides.');
    (err as Error & { code?: string }).code = 'bad-credentials';
    throw err;
  }
  const { hashB64 } = await hashPassword(parsed.password, user.passwordSalt);
  if (!constantTimeEqual(hashB64, user.passwordHash)) {
    const err = new Error('Identifiants invalides.');
    (err as Error & { code?: string }).code = 'bad-credentials';
    throw err;
  }
  // Update lastLogin (immutable update)
  const updated: User = { ...user, lastLoginMs: Date.now() };
  setUsers(users.map((u) => (u.uid === user.uid ? updated : u)));
  setSession({ uid: user.uid });
  return updated;
}

/** Deconnecte l'utilisateur courant. Garde son compte intact. */
export function logout(): void {
  setSession({ uid: null });
}

/** Met a jour le profil de l'utilisateur courant. */
export function updateCurrentUser(patch: Partial<Omit<User, 'uid' | 'passwordHash' | 'passwordSalt'>>): User | null {
  const u = currentUser();
  if (!u) return null;
  const updated: User = { ...u, ...patch };
  const list = getUsers().map((x) => (x.uid === u.uid ? updated : x));
  setUsers(list);
  return updated;
}
