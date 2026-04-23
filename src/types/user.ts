import { z } from 'zod';
import type { ContactCategory, ProfileFieldKey } from './contact';
import { CONTACT_CATEGORIES, PROFILE_FIELD_KEYS } from './contact';

/** Profil utilisateur + champs et permissions par categorie. */
export interface User {
  readonly uid: string;
  readonly fullName: string;
  readonly email: string;
  /** PBKDF2 hash du password (jamais en clair). */
  readonly passwordHash: string;
  readonly passwordSalt: string;
  readonly twoFactor: TwoFactorConfig;
  readonly profile: Profile;
  readonly createdAtMs: number;
  readonly lastLoginMs: number;
  readonly plan: PlanId;
  readonly planExpiresAtMs: number;
  readonly language: string;
  readonly avatarUrl?: string;
}

export type PlanId = 'free' | 'plus' | 'pro';

export interface TwoFactorConfig {
  readonly enabled: boolean;
  readonly method: 'totp' | 'sms' | null;
  /** Secret TOTP chiffre par la cle derivee du password (jamais en clair). */
  readonly secretEncrypted: string | null;
  readonly phoneE164: string | null;
}

export interface Profile {
  readonly fields: Partial<Record<ProfileFieldKey, string>>;
  /** Par categorie, quels champs sont partages. Un champ non liste = pas partage. */
  readonly permissionsByCategory: Readonly<Record<ContactCategory, readonly ProfileFieldKey[]>>;
  readonly customFields: readonly CustomField[];
}

export interface CustomField {
  readonly key: string;
  readonly value: string;
  readonly visibleCategories: readonly ContactCategory[];
}

/** Permissions par defaut : Famille voit tout, Amis voit social, Collegues voit pro. */
export function defaultPermissions(): Record<ContactCategory, readonly ProfileFieldKey[]> {
  return {
    family:        [...PROFILE_FIELD_KEYS],
    friends:       ['phoneNumber', 'whatsapp', 'instagram', 'tiktok', 'bio'],
    acquaintances: ['phoneNumber', 'whatsapp'],
    colleagues:    ['email', 'linkedin', 'workAddress', 'bio'],
    utilities:     ['phoneNumber'],
    business:      ['email', 'gmail', 'linkedin', 'website', 'workAddress'],
    other:         ['phoneNumber'],
  };
}

export function emptyProfile(): Profile {
  return {
    fields: {},
    permissionsByCategory: defaultPermissions() as Record<ContactCategory, readonly ProfileFieldKey[]>,
    customFields: [],
  };
}

/* ============ Zod validation ============ */

export const FullNameSchema = z.string().trim().min(1).max(60);
export const EmailSchema = z.string().trim().email();
export const PasswordSchema = z
  .string()
  .min(8, 'Mot de passe trop court (8 min)')
  .max(100)
  .regex(/[A-Z]/, 'Doit contenir une majuscule')
  .regex(/[a-z]/, 'Doit contenir une minuscule')
  .regex(/\d/, 'Doit contenir un chiffre');

export const SignupSchema = z.object({
  fullName: FullNameSchema,
  email: EmailSchema,
  password: PasswordSchema,
});

export type SignupInput = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  fullName: FullNameSchema,
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// Anti-unused warnings si jamais qqc echappe a la validation
void CONTACT_CATEGORIES;
