/**
 * Switchr — utilitaires crypto (WebCrypto).
 *
 * - PBKDF2 (SHA-256, 100k iterations) pour hasher les mots de passe.
 * - AES-GCM 256 pour chiffrer secrets locaux (TOTP secret, payload sensible).
 *
 * Aucun mot de passe en clair n'est jamais persiste. Aucune cle n'est envoyee
 * a un serveur — tout reste cote client.
 */

import { LIMITS } from '../config';

const enc = new TextEncoder();
const dec = new TextDecoder();

/* =================== helpers binaires =================== */

export function bytesToBase64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]!);
  return btoa(s);
}

export function base64ToBytes(b64: string): Uint8Array {
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function randomBytes(n: number): Uint8Array {
  const arr = new Uint8Array(n);
  crypto.getRandomValues(arr);
  return arr;
}

/* =================== PBKDF2 (mots de passe) =================== */

/**
 * Hash PBKDF2 d'un mot de passe avec un sel.
 * Si saltB64 n'est pas fourni, en genere un nouveau (16 bytes aleatoires).
 */
export async function hashPassword(
  password: string,
  saltB64?: string,
): Promise<{ hashB64: string; saltB64: string }> {
  const salt = saltB64 ? base64ToBytes(saltB64) : randomBytes(16);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password) as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: LIMITS.PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    256, // 32 bytes
  );
  return {
    hashB64: bytesToBase64(new Uint8Array(bits)),
    saltB64: bytesToBase64(salt),
  };
}

/** Compare en temps constant deux strings base64 (pour eviter les timing attacks). */
export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* =================== AES-GCM (secrets locaux) =================== */

/** Derive une cle AES-GCM 256 bits depuis un mot de passe + sel. */
async function deriveAesKey(password: string, saltB64: string): Promise<CryptoKey> {
  const salt = base64ToBytes(saltB64);
  const km = await crypto.subtle.importKey(
    'raw',
    enc.encode(password) as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: LIMITS.PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    km,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function aesEncrypt(plain: string, password: string, saltB64: string): Promise<string> {
  const key = await deriveAesKey(password, saltB64);
  const iv = randomBytes(12);
  const ct = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      enc.encode(plain) as BufferSource,
    ),
  );
  // packet = iv (12) + ciphertext
  const packet = new Uint8Array(iv.length + ct.length);
  packet.set(iv, 0);
  packet.set(ct, iv.length);
  return bytesToBase64(packet);
}

export async function aesDecrypt(packetB64: string, password: string, saltB64: string): Promise<string> {
  const packet = base64ToBytes(packetB64);
  const iv = packet.slice(0, 12);
  const ct = packet.slice(12);
  const key = await deriveAesKey(password, saltB64);
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    ct as BufferSource,
  );
  return dec.decode(pt);
}

/* =================== avatar color =================== */

/** Couleur deterministe (hex) derivee d'un nom — pour avatar par defaut. */
export function colorFromName(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const palette = ['#1E90FF', '#21B573', '#FF7A45', '#9B5DE5', '#F15BB5', '#00BBF9', '#FFB740', '#5B6472'];
  return palette[h % palette.length]!;
}
