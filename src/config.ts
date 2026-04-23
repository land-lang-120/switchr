/** Configuration globale Switchr. */

export const APP_VERSION = '1.0.0' as const;

export const APP_ENV = (import.meta.env.VITE_APP_ENV ?? 'dev') as 'dev' | 'staging' | 'prod';
export const IS_DEV = APP_ENV === 'dev';
export const IS_PROD = APP_ENV === 'prod';

export const FEATURES = {
  USE_EMULATORS: import.meta.env.VITE_ENABLE_EMULATORS === 'true',
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
} as const;

export const LIMITS = {
  NAME_MAX: 60,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 100,
  FIELD_MAX: 200,
  BIO_MAX: 280,
  CUSTOM_FIELDS_MAX: 10,
  PBKDF2_ITERATIONS: 100_000,
  TOTP_WINDOW_MS: 30_000,
  TRANSFER_MAX_BYTES: 5 * 1024 * 1024 * 1024, // 5 GB
  TRANSFER_TTL_MS: 24 * 3600 * 1000, // 24 h
} as const;

export const LS_KEYS = {
  session: 'switchr_session',
  profile: 'switchr_profile',
  contacts: 'switchr_contacts',
  theme: 'switchr_theme',
  lang: 'switchr_lang',
  onboarded: 'switchr_onboarded',
  premium: 'switchr_premium',
  trialStarted: 'switchr_trial_started',
} as const;

/** Palette principale Switchr (identite bleue). */
export const BRAND = {
  primary: '#1E90FF',
  primaryDark: '#0B5ED7',
  primarySoft: '#D6EAFF',
} as const;
