# 📊 switchr — Suivi

> Voir aussi : [CAHIER-CHARGES.md](CAHIER-CHARGES.md) (spec complète, validée)
> Mis à jour : **2026-04-23**

| | |
|---|---|
| **Stack** | React 18 + TypeScript + Vite + Firebase + WebCrypto |
| **Statut** | 🟠 Dev — shell bootable + 6 écrans MVP, typecheck clean |
| **Plateformes** | Web (PWA) + Android/iOS via Capacitor (à venir) |
| **Pitch** | App de transfert de contacts/médias entre téléphones via QR + permissions granulaires |

---

## ✅ Fait

### Foundation
- Cahier de charges complet et validé (`CAHIER-CHARGES.md`)
- Scaffold projet Vite : tsconfig, ESLint, Prettier, vite.config
- GitHub Actions workflow setup
- Lib QR génération (`qrcode`) installée
- Types : contacts, medias, permissions, exchange, user (Zod schemas)
- Architecture conceptuelle : catégories de permissions, modèle de transfert
- Style global (CSS vars + dark mode + safe-area + Manrope)

### Shell bootable (session 23 avril)
- `main.tsx` + `App.tsx` (router state-based, comme chrome-messenger)
- `services/auth.ts` — auth locale avec PBKDF2 (signup/login/logout/updateCurrentUser)
- `utils/crypto.ts` — PBKDF2 + AES-GCM via WebCrypto + helpers base64/random + colorFromName
- `contexts/AuthContext.tsx` — provider + useAuth hook
- Composants UI : Button, Input, Logo (SVG)

### Écrans MVP
- **WelcomeScreen** — pitch + CTA Signup/Login
- **SignupScreen** — formulaire Zod-validated, auto-capitalize nom, gestion erreurs
- **LoginScreen** — formulaire login avec timing-safe comparison
- **HomeScreen** — dashboard avec avatar, stats, 3 actions principales (Échanger, Scanner, Transférer)
- **ProfileScreen** — édition champs + permissions par catégorie (2 onglets, lock proOnly pour comptes free)
- **ExchangeScreen** — génération QR filtré par catégorie de destinataire, téléchargement PNG

### Validation (session 23 avril)
- `npm install` finalisé (clean reinstall TypeScript)
- `tsc --noEmit` ✅ **clean** (0 erreurs)
- 5 corrections crypto.ts : casts `BufferSource` pour compat TS 5.4+ (Uint8Array/SharedArrayBuffer)
- `lsRemove` import inutilisé retiré de `services/auth.ts`

## 🔄 En cours

- Rien en cours — shell + 6 écrans bootables, prêt à être testé en `npm run dev`

## 📋 À faire

### Prochaine session
1. **ContactsScreen** : scanner QR + parser le payload + lister contacts reçus
   - Composant scanner via lib `qr-scanner` ou `@yudiel/react-qr-scanner`
   - Validation Zod du payload reçu
   - Persistance localStorage des contacts reçus
2. **TransferScreen** (Pro) : flux transfert téléphone-téléphone
   - Sélection contenu (contacts + médias)
   - Vérification espace disque (Storage Quota API)
   - Session avec PIN 6 chiffres
   - QR session + endpoint réception

### Plus tard
4. Capacitor Android + iOS (accès contacts natifs via plugin)
5. Schéma Firestore (sessions de transfert + audit log + sync optionnel)
6. Tests Playwright E2E (flow échange QR entre 2 onglets)
7. Audit sécurité (E2E encryption ECDH + AES sur les payloads transférés)
8. 2FA TOTP (le type est défini, manque l'UI + service)
9. i18n 8 langues (folder vide actuellement)
10. Page promo dans clonex-studio
11. Build APK + soumission Play Store
