import type { ContactCategory, ProfileFieldKey } from './contact';

/**
 * Payload encode dans un QR code d'echange de contact.
 * Version pour evolution future sans casser les anciens QR.
 */
export interface ExchangePayload {
  readonly v: 1;
  readonly kind: 'contact-exchange';
  readonly fullName: string;
  readonly categoryForMe: ContactCategory; // la categorie que le partageur a choisie pour le destinataire
  readonly fields: Partial<Record<ProfileFieldKey, string>>;
  readonly customFields: Array<{ key: string; value: string }>;
  readonly issuedAtMs: number;
  readonly issuerAvatarHex?: string; // couleur deterministe pour avatar par defaut
}

/** Payload pour un transfert de donnees entier (Pro). */
export interface TransferPayload {
  readonly v: 1;
  readonly kind: 'phone-transfer';
  readonly sessionId: string;
  readonly fullName: string;
  readonly totalBytes: number;
  readonly itemsByKind: Readonly<Record<string, number>>;
  readonly expiresAtMs: number;
  readonly pin?: string; // code 6 chiffres pour confirmer
}

export type AnyQrPayload = ExchangePayload | TransferPayload;
