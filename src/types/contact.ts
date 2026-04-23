/**
 * Categories de contacts — base pour les permissions granulaires.
 * L'utilisateur configure quels CHAMPS sont partages avec quelle CATEGORIE.
 */

export type ContactCategory =
  | 'family'
  | 'friends'
  | 'acquaintances'
  | 'colleagues'
  | 'utilities'
  | 'business'
  | 'other';

export const CONTACT_CATEGORIES: readonly ContactCategory[] = [
  'family',
  'friends',
  'acquaintances',
  'colleagues',
  'utilities',
  'business',
  'other',
] as const;

export const CATEGORY_LABELS: Record<ContactCategory, { emoji: string; labelFr: string; labelEn: string }> = {
  family:        { emoji: '👨‍👩‍👧‍👦', labelFr: 'Famille',       labelEn: 'Family' },
  friends:       { emoji: '🤝',            labelFr: 'Amis',          labelEn: 'Friends' },
  acquaintances: { emoji: '👋',            labelFr: 'Connaissances', labelEn: 'Acquaintances' },
  colleagues:    { emoji: '💼',            labelFr: 'Collegues',     labelEn: 'Colleagues' },
  utilities:     { emoji: '🔧',            labelFr: 'Utilitaires',   labelEn: 'Utilities' },
  business:      { emoji: '🏢',            labelFr: 'Pro / Business',labelEn: 'Business' },
  other:         { emoji: '📌',            labelFr: 'Autre',         labelEn: 'Other' },
};

/**
 * Champs disponibles dans un profil. Chacun est toggle par l'user par categorie.
 */
export type ProfileFieldKey =
  | 'phoneNumber'
  | 'whatsapp'
  | 'telegram'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'linkedin'
  | 'twitter'
  | 'gmail'
  | 'email'
  | 'website'
  | 'homeAddress'
  | 'workAddress'
  | 'bio';

export const PROFILE_FIELD_KEYS: readonly ProfileFieldKey[] = [
  'phoneNumber',
  'whatsapp',
  'telegram',
  'instagram',
  'facebook',
  'tiktok',
  'linkedin',
  'twitter',
  'gmail',
  'email',
  'website',
  'homeAddress',
  'workAddress',
  'bio',
] as const;

export const FIELD_META: Record<ProfileFieldKey, { emoji: string; labelFr: string; proOnly: boolean; type: 'text' | 'tel' | 'email' | 'url' | 'textarea' }> = {
  phoneNumber:  { emoji: '📞', labelFr: 'Numero de telephone', proOnly: false, type: 'tel' },
  whatsapp:     { emoji: '💬', labelFr: 'WhatsApp',            proOnly: true,  type: 'tel' },
  telegram:     { emoji: '✈️', labelFr: 'Telegram',            proOnly: true,  type: 'text' },
  instagram:    { emoji: '📷', labelFr: 'Instagram',           proOnly: true,  type: 'text' },
  facebook:     { emoji: '📘', labelFr: 'Facebook',            proOnly: true,  type: 'text' },
  tiktok:       { emoji: '🎵', labelFr: 'TikTok',              proOnly: true,  type: 'text' },
  linkedin:     { emoji: '💼', labelFr: 'LinkedIn',            proOnly: true,  type: 'url' },
  twitter:      { emoji: '🐦', labelFr: 'X / Twitter',         proOnly: true,  type: 'text' },
  gmail:        { emoji: '✉️', labelFr: 'Gmail',               proOnly: true,  type: 'email' },
  email:        { emoji: '📧', labelFr: 'Email',               proOnly: true,  type: 'email' },
  website:      { emoji: '🌐', labelFr: 'Site web',            proOnly: true,  type: 'url' },
  homeAddress:  { emoji: '🏠', labelFr: 'Adresse maison',      proOnly: true,  type: 'text' },
  workAddress:  { emoji: '🏢', labelFr: 'Adresse travail',     proOnly: true,  type: 'text' },
  bio:          { emoji: '📝', labelFr: 'Bio',                 proOnly: true,  type: 'textarea' },
};

/** Carte de contact recue apres scan d'un QR. */
export interface ReceivedContact {
  readonly id: string;
  readonly fullName: string;
  readonly category: ContactCategory;
  readonly fields: Partial<Record<ProfileFieldKey, string>>;
  readonly receivedAtMs: number;
  readonly notes?: string;
}
