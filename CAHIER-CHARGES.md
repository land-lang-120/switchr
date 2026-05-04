# CAHIER DES CHARGES — Switchr

---

## 📇 Fiche d'identité

| Attribut | Valeur |
|---|---|
| **Nom** | Switchr |
| **Identifiant technique** | `switchr` |
| **Version cible** | 1.0.0 |
| **Type** | Transfert de donnees + echange intelligent de contacts + cloud backup |
| **Plateformes** | PWA Web + Android (TWA/Capacitor) + iOS |
| **Langues** | fr, en, es, pt, de, it, ar, zh (8 au minimum) |
| **Décideur produit** | Pino |
| **Dernière mise à jour** | 2026-05-04 (snapshot post-audit, 4 écrans visuels confirmés) |
| **Statut** | 🟠 Dev — UI shell OK, logique business à compléter |
| **Repo** | `github.com/land-lang-120/switchr` |
| **Pricing** | Free + Plus (à définir) + Pro **max $2.99/mois** |

---

## 📊 Snapshot 2026-05-04 — où on en est

### ✅ Confirmé en visuel (Puppeteer screenshots)

| Écran | Statut | Notes |
|---|---|---|
| **Welcome** | ✅ Render OK | Logo bleu + pitch + 2 CTA (Creer compte / J'ai déjà compte) |
| **Signup** | ✅ Render OK | 3 champs : Nom complet, Email, Mot de passe (hint "8+ car, 1 maj, 1 chiffre") |
| **Login** | ✅ Render OK | "Bon retour" + Nom + Mot de passe + bouton "Se connecter" |
| **Home** | ⚠️ Pas encore screenshot | À atteindre via signup réel |
| **Profile** | ⚠️ Pas encore screenshot | Idem |
| **Exchange** | ⚠️ Pas encore screenshot | Idem |

### 🐛 Bugs détectés et fixés

| # | Bug | Statut | Solution |
|---|---|---|---|
| **BUG-SW-1** | Splash HTML `#splash` (z-index 9999) jamais retiré au mount React → cache l'app à jamais | ✅ FIXÉ | `requestAnimationFrame` dans main.tsx → `splash.classList.add('hide')` + remove après 600ms |

### 🐛 Bugs en cours de validation

| # | Sujet | À valider Pino |
|---|---|---|
| **BUG-SW-2?** | Pas de champ "Confirmer le mot de passe" (3 champs au lieu de 4) | Ajouter ? Évite les typos password mais alourdit le form |
| **BUG-SW-3?** | Pas de validation password en live (pas d'indicateur visuel ✅/❌ sur "8+ car, 1 maj, 1 chiffre") | Ajouter une checklist dynamique pendant la frappe ? |

### 📋 À valider techniquement (audit fonctionnel à faire)

- [ ] Signup réel : crée bien un user dans `localStorage[switchr_users]` avec PBKDF2 hash ?
- [ ] Login réel : matche bien le hash via timing-safe comparison ?
- [ ] Génération QR : produit un QR scannable par d'autres apps QR ?
- [ ] Scanner QR : composant CameraScanner existe-t-il ? (pas implémenté à confirmer)
- [ ] Permissions par catégorie : UI checkbox + filtrage côté envoi du QR ?
- [ ] Transfert intégral : code de TransferChannel (WebRTC ou Firebase) ?

### 🧪 Approche test-driven (consigne Pino)

Pino veut un travail minutieux avec micro-tests pour CHAQUE morceau de code :
- **Vitest** : déjà installé, à utiliser pour chaque fonction critique (`utils/crypto.ts`, `services/auth.ts`, parsing QR, etc.)
- **Playwright** : déjà installé, à utiliser pour les flows E2E (signup → home → exchange → ...)
- **Puppeteer screenshots** : déjà en place (`screenshot-screens.mjs`) pour validation visuelle régressive
- **Règle senior** : aucune nouvelle feature mergée sans au minimum 1 test unitaire + validation visuelle

---

## 1. Vision & Pitch

### 1.1 Elevator pitch

> **Switchr** est l'app qui rend changer de téléphone **instantané et sans stress**, et qui transforme l'échange de contacts en une expérience intelligente : scanne un QR, choisis la catégorie de la personne (famille/amis/collègue/pro), et elle ne reçoit que les informations que tu as autorisées pour sa catégorie. Ton téléphone, tes règles.

### 1.2 Problème résolu

- **Changer de téléphone** = perdre des heures à transférer contacts, photos, fichiers par Bluetooth, Drive, câble USB... et souvent on oublie des trucs.
- **Échanger ses infos** = donner son numéro, puis son WhatsApp, puis son Insta, puis son email pro, puis son adresse... répété à chaque personne, sans contrôle sur qui voit quoi.
- **Pas de contrôle fin** : soit on donne tout, soit on refuse.

### 1.3 Solution

- **Transfert intégral** en un scan QR : contacts + médias (photos, vidéos, audios, documents) du vieux vers le nouveau téléphone, avec vérification d'espace disque.
- **Permissions granulaires par catégorie de contact** : ta famille voit ton adresse maison, ton collègue voit seulement ton Gmail pro et ton LinkedIn.
- **QR d'échange contextuel** : avant de partager, tu choisis la catégorie de l'autre, l'app filtre automatiquement ce qui lui est envoyé.

### 1.4 Différenciation

| Fonctionnalité | Switchr | Google Contacts | Wavit | hihello |
|---|---|---|---|---|
| Transfert téléphone-téléphone complet (contacts + médias) | ✅ | ❌ | ❌ | ❌ |
| Permissions par catégorie avant partage | ✅ | ❌ | Partiel | Partiel |
| QR code qui adapte le contenu selon destinataire | ✅ | ❌ | ❌ | ❌ |
| Vérification espace disque avant import | ✅ | ❌ | N/A | N/A |
| Chiffrement E2E des données transitées | ✅ | ❌ | ❌ | ❌ |
| Offline-capable (PWA) | ✅ | ❌ | Partiel | ❌ |

---

## 2. Cibles & personas

### 2.1 Cible principale

- **Âge** : 18-50 ans
- **Profil** : actif, smartphone-dépendant, change de téléphone tous les 2-3 ans, rencontre régulièrement de nouvelles personnes (pro ou perso)
- **Contexte** : Afrique, Europe, Amérique du Nord ; zones avec réseau mobile + Wi-Fi intermittent

### 2.2 Personas

#### Persona 1 : Sarah, 32 ans, commerciale multi-casquettes
- **Besoin** : partager son numéro pro à ses clients, son Insta perso à ses amis, son LinkedIn à ses collègues
- **Frustration** : donne son numéro à tout le monde puis reçoit des messages pro sur WhatsApp perso
- **Ce qu'elle attend** : un switch de catégorie instantané avant le QR

#### Persona 2 : Mamadou, 28 ans, entrepreneur qui change de téléphone
- **Besoin** : transférer 200+ contacts + 15 Go de photos/vidéos du vieux Samsung vers le nouveau Pixel en 10 minutes max
- **Frustration** : Google Backup ne prend pas tout, Bluetooth trop lent, câble USB ne marche pas partout
- **Ce qu'il attend** : un scan QR et hop, tout passe + vérification d'espace

#### Persona 3 : Léa, 22 ans, étudiante
- **Besoin** : échanger numéro + Insta + Snap avec ses amis à la fac sans jamais donner son numéro à des inconnus
- **Frustration** : les gens voient tout si elle partage la carte
- **Ce qu'elle attend** : version gratuite qui gère juste les numéros, elle passera Plus quand elle bossera

### 2.3 Non-cible

- Entreprises > 500 employés avec besoins CRM (ce n'est pas Salesforce)
- Seniors peu à l'aise avec smartphone (UI trop moderne)

---

## 3. Fonctionnalités

### 3.1 MVP (v1.0) — P0

| # | Feature | Description | Plan | Priorité |
|---|---|---|---|---|
| F1 | Signup/Login avec nom complet + mot de passe | Authentification de base | Free | 🔴 P0 |
| F2 | 2FA optionnelle (TOTP ou SMS) | Authentification renforcée | Free | 🔴 P0 |
| F3 | Profil multi-champs | Numéro, WhatsApp, Telegram, FB, IG, TikTok, LinkedIn, Gmail, adresses, bio | Free (limité aux numéros) | 🔴 P0 |
| F4 | Catégories de contacts | Famille / Amis / Connaissances / Collègues / Utilitaires / Autre | Free | 🔴 P0 |
| F5 | Permissions par catégorie | Matrice champ × catégorie = visible ou pas | Free (basique), Plus (avancé) | 🔴 P0 |
| F6 | Génération QR contextuelle | L'user choisit une catégorie → QR contient seulement les infos autorisées | Free (num seul), Plus (tout) | 🔴 P0 |
| F7 | Scanner QR | Caméra scanne → affiche carte de contact + bouton ajouter | Free/Plus | 🔴 P0 |
| F8 | Liste des contacts reçus | Chaque contact scanné est sauvegardé avec la catégorie | Free | 🔴 P0 |
| F9 | Plans Premium | Free / Plus / Pro | — | 🔴 P0 |
| F10 | Settings + Logout + Suppression compte | RGPD compliant | Free | 🔴 P0 |

### 3.1bis 🆕 Cloud Backup — feature ajoutée 2026-05-04

> **Décision Pino** : ajouter le stockage en ligne payant pour récupérer ses
> données quand le téléphone précédent est perdu/cassé/volé (cas où le
> transfert direct par QR est impossible).

#### Mécanique

| Aspect | Détail |
|---|---|
| **But** | Backup chiffré des contacts + médias dans le cloud, lié au compte Switchr (récupération depuis n'importe quel device après login) |
| **Quand on l'utilise** | Téléphone perdu/cassé/volé → le transfert direct via QR n'est plus possible → l'utilisateur se logue sur un nouveau device et restaure depuis le cloud |
| **Chiffrement** | E2E avec une clé dérivée du password user (PBKDF2) — le serveur ne peut PAS lire les données, juste les stocker |
| **Backend** | Firebase Storage (chiffré côté client AVANT upload) + Firestore pour les métadonnées (manifeste de backup) |
| **Sync auto** | Optionnel — toutes les 24h en background si Pro, manuel sinon |
| **Quotas** | Free : pas de cloud backup. Plus : 1 GB. Pro : 50 GB. |
| **Pricing** | **Max $2.99 / mois** (impératif Pino, pas plus). Suggéré : Plus = $0.99/mois OR offrir avec ads, Pro = $2.99/mois full features |
| **Forfait annuel** | Réduction = $2.99 × 10 mois facturé annuellement = **$29.90/an** (équivaut 10 mois au lieu de 12 → 17% off). Limite max stricte respectée. |

#### Plans actualisés

| Plan | Prix | Cloud Backup | Permissions | QR catégoriel | Transfert direct | Boosters/extras |
|---|---|---|---|---|---|---|
| **Free** | 0$ | ❌ aucun | Basique (numéros seul) | ✅ | Limité (50 contacts max) | 1 catégorie |
| **Plus** | $0.99/mois | 1 GB | Avancé (tous champs) | ✅ | Illimité | 4 catégories + thèmes |
| **Pro** | **$2.99/mois** | **50 GB** | Avancé + custom | ✅ | Illimité (médias inclus) | Tout débloqué + sync auto |
| **Pro annuel** | $29.90/an | Idem Pro | — | — | — | -17% vs mensuel |

#### Restauration (flow utilisateur)

```
[Téléphone perdu] → l'utilisateur achète/utilise un nouveau téléphone
   ↓
1. Installe Switchr → Login avec email+password (le même qu'avant)
   ↓
2. Switchr détecte qu'un backup cloud existe pour ce compte
   ↓
3. Affiche : "💾 Backup trouvé du <date>, X contacts + Y Go médias. Restaurer ?"
   ↓
4. User confirme → Switchr télécharge depuis Firebase Storage
   ↓
5. Déchiffrement local avec la clé PBKDF2 du password
   ↓
6. Contacts + médias restaurés dans le téléphone
```

#### Sécurité critique

- ⚠️ **Le password n'est JAMAIS envoyé au serveur** — Firebase Auth utilise un autre flow (email link OU password hash via Firebase, mais notre clé de déchiffrement est dérivée localement).
- ⚠️ **Si user oublie son password → données perdues** (Firebase ne peut pas déchiffrer). Mention claire dans les CGU + warning lors de l'activation.
- ⚠️ **Authentification 2FA recommandée** pour les comptes Pro (TOTP).

#### À implémenter

| # | Composant | Fichier | Tests |
|---|---|---|---|
| F30 | `services/cloud-backup.ts` | API : `enableBackup()`, `triggerBackup()`, `listBackups()`, `restoreFromBackup()` | Vitest unitaires |
| F31 | `utils/encrypt-blob.ts` | AES-GCM chunk encryption pour gros médias | Vitest avec fixtures |
| F32 | `features/backup/BackupSettingsScreen.tsx` | UI activation + quotas + dernière sync | Playwright E2E |
| F33 | `features/backup/RestoreScreen.tsx` | UI restauration au login | Playwright E2E |
| F34 | `services/billing.ts` | Stripe / Google Play / StoreKit wrappers | Manual test (sandbox) |

---

### 3.2 v1.1 (1-2 mois post-lancement) — P1

| # | Feature | Description | Plan |
|---|---|---|---|
| F20 | Transfert téléphone → téléphone : contacts | QR source → cible scanne → sync contacts | Pro |
| F21 | Transfert photos | Avec vérification espace disque | Pro |
| F22 | Transfert vidéos | Avec compression optionnelle | Pro |
| F23 | Transfert audios (enregistrements + musiques) | Préserve métadonnées | Pro |
| F24 | Transfert documents | PDF, DOCX, XLSX, TXT | Pro |
| F25 | Sélection partielle si espace insuffisant | UI intuitive avec aperçu tailles | Pro |
| F26 | Biométrie (empreinte / Face ID) | Auth rapide | Free |
| F27 | Export JSON de tous les contacts | Sauvegarde/migration vers autre service | Free |
| F28 | Notifications quand un contact ajoute tes infos | Push FCM | Plus/Pro |

### 3.3 v2.0+ — P2

- NFC échange instantané (tap phones)
- AirDrop cross-platform
- Cartes de visite digitales imprimables (QR)
- Intégration CRM pour freelances (Notion, Airtable)
- API pour apps tierces
- Multi-device sync
- Historique des échanges (qui a scanné mon QR quand)

### 3.4 Hors scope (volontairement exclu)

- Messagerie (c'est le domaine de Chrome Messenger)
- Appels audio/video (idem)
- Réseau social (pas d'onboarding "trouvez des amis")

---

## 4. User flows

### 4.1 Flow : Onboarding

```
Welcome → Signup (nom + password) → [2FA optionnelle] → Configure profil → Choisir catégories permissions → Home
```

### 4.2 Flow : Échanger un contact

```
Home → tap "Partager" → Choisir catégorie du destinataire (Amis/Famille/Collègue/...)
     → QR généré avec les infos filtrées → Montrer à l'autre
```

### 4.3 Flow : Scanner un QR

```
Home → tap "Scanner" → Caméra → Détection QR → Aperçu carte contact
     → Confirmer + assigner catégorie → Enregistrer dans contacts
```

### 4.4 Flow : Changer de téléphone (Pro)

```
Ancien téléphone : Settings → Transférer → Choisir données (contacts/photos/vidéos/...) → Génère QR transfert
Nouveau téléphone : Scanner → Vérification espace → Si OK : démarre download / Si KO : UI sélection partielle
```

### 4.5 États d'erreur

| Erreur | Cause | Message |
|---|---|---|
| Réseau KO | Offline | "Pas de connexion, réessaye plus tard" |
| Espace insuffisant | Stockage plein sur cible | Popup : "Tu as X Go dispo, le transfert fait Y Go. Sélectionne ce que tu veux importer." |
| QR invalide | Version incompatible / expiré | "Ce QR code n'est plus valide. Demande à ton contact d'en générer un nouveau." |
| 2FA échouée | Code OTP incorrect | "Code incorrect, il te reste X tentatives" |
| Contact refuse de partager | Permissions restrictives | "Ce contact n'a pas partagé cette info pour ta catégorie." |

---

## 5. Architecture technique

### 5.1 Stack

| Couche | Choix | Version |
|---|---|---|
| **Frontend** | React + TypeScript | 18.2 + 5.4 |
| **Build** | Vite + vite-plugin-pwa | 5.x |
| **Styling** | CSS-in-JS inline + CSS vars | — |
| **État** | useState/useReducer + Context | natif React |
| **Backend** | Firebase (Auth + Firestore + Storage + FCM) | v10 |
| **Crypto** | Web Crypto API natif | PBKDF2 + AES-GCM + TOTP (otpauth lib) |
| **QR codes** | `qrcode` (generation) + `@zxing/browser` (scanner caméra) | recent |
| **Paiements** | Stripe Checkout (web) + Google Play Billing (Android) + StoreKit (iOS) | — |
| **Tests** | Vitest + Playwright | — |

### 5.2 Modèle de données Firestore

#### `users/{uid}`

```ts
interface User {
  uid: string;
  fullName: string;
  email: string;              // pour 2FA + récupération
  passwordHash: string;       // PBKDF2 100k + salt
  passwordSalt: string;
  twoFactor: {
    enabled: boolean;
    method: 'totp' | 'sms' | null;
    secretEncrypted?: string; // chiffré localement par le password
    phoneE164?: string;
  };
  createdAtMs: number;
  lastLoginMs: number;
  plan: 'free' | 'plus' | 'pro';
  planExpiresAtMs: number;
  language: string;
  avatarUrl?: string;
}
```

#### `users/{uid}/profile` (sous-document)

```ts
interface Profile {
  readonly fields: {
    phoneNumber: string;
    whatsapp: string;
    telegram: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    linkedin: string;
    gmail: string;
    homeAddress: string;
    workAddress: string;
    bio: string;
    website: string;
    twitter: string;
    customFields: Array<{ key: string; value: string }>;
  };
  /** Par catégorie, quels champs sont visibles quand on partage son QR. */
  readonly permissionsByCategory: Record<ContactCategory, readonly FieldKey[]>;
}

type ContactCategory = 'family' | 'friends' | 'acquaintances' | 'colleagues' | 'utilities' | 'business' | 'other';
type FieldKey = keyof Profile['fields'];
```

#### `contacts/{ownerUid}/list/{contactId}`

```ts
interface Contact {
  contactId: string;
  fullName: string;
  category: ContactCategory;
  fields: Partial<Profile['fields']>; // seulement ce qui a été partagé
  receivedAtMs: number;
  notes: string;
}
```

#### `transfers/{transferId}` (Pro, v1.1)

```ts
interface Transfer {
  transferId: string;
  sourceUid: string;
  targetUid: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  items: { kind: 'contact' | 'photo' | 'video' | 'audio' | 'doc'; count: number; totalBytes: number };
  storagePath: string;        // Firebase Storage
  expiresAtMs: number;        // auto-delete après 24h
  createdAtMs: number;
}
```

### 5.3 Sécurité

- **Mot de passe** : jamais stocké en clair, PBKDF2 SHA-256 100 000 iterations + salt aléatoire 16 bytes
- **2FA TOTP** : secret stocké chiffré par une clé dérivée du mot de passe → impossible à lire sans le password
- **Données échangées** : chiffrées E2E pour le transfert téléphone-téléphone (AES-GCM 256 + clé éphémère ECDH)
- **Firebase rules strictes** : chaque user ne peut lire/écrire que ses propres documents
- **Pas de partage silencieux** : chaque échange nécessite confirmation explicite

---

## 6. Design & UX

### 6.1 Identité visuelle

- **Logo** : cercle bleu + triangle inversé (personnification abstraite, symbolisant "switch")
- **Couleurs primaires** : 
  - Bleu principal : `#1E90FF`
  - Bleu foncé : `#0B5ED7`
  - Bleu clair (soft) : `#D6EAFF`
- **Police** : Manrope ou Inter (moderne, géométrique)
- **Style** : minimaliste, beaucoup d'espace blanc, coins arrondis (radius 14-20px)

### 6.2 Composants clés

| Composant | Rôle |
|---|---|
| `<SwitchrLogo>` | Logo SVG adaptatif |
| `<QrCard>` | Carte QR avec catégorie sélectionnable |
| `<ContactCard>` | Affichage riche d'un contact reçu |
| `<PermissionMatrix>` | Tableau champs × catégories avec toggles |
| `<TransferProgress>` | Barre de progression transfert par type de média |

---

## 7. Sécurité & Confidentialité

### 7.1 Principes

- **Données sensibles** : numéros, emails, adresses ⇒ tout est chiffré en transit + règles Firestore par propriétaire
- **Mot de passe** : PBKDF2 100k, jamais en clair
- **2FA** : TOTP ou SMS, le secret TOTP est chiffré par le mot de passe utilisateur
- **Permissions** : revérifiées côté serveur pour chaque demande de données

### 7.2 RGPD

- Export complet des données en JSON
- Suppression du compte = suppression totale sur Firebase Auth + tous les documents Firestore + Storage
- Politique de confidentialité accessible dès le signup

### 7.3 Storage

- Transferts éphémères : auto-delete sous 24h (Cloud Function scheduled)
- Limite : 5 Go par transfert en v1.1

---

## 8. Plans & Monétisation

### 8.1 Tarification

| Plan | Prix | Inclus |
|---|---|---|
| **Free** | 0 € | Signup + 2FA + profil limité aux numéros + 6 catégories + échange QR basique |
| **Plus** | 2,99 € / mois | Tout Free + tous les champs (WhatsApp, LinkedIn, Gmail, adresses, réseaux sociaux, bio, custom fields) + stats de scans |
| **Pro** | 6,99 € / mois | Tout Plus + transfert téléphone-téléphone (contacts + photos + vidéos + audios + documents) + vérification espace + sélection partielle |

### 8.2 Essai gratuit

- **30 jours d'essai Pro** au premier lancement (comme Chrome Messenger)
- Après expiration : retour au plan Free automatique sauf si souscription

### 8.3 IAP

- **Web** : Stripe Checkout (hosted)
- **Android** : Google Play Billing (via TWA + Digital Asset Links)
- **iOS** : StoreKit (via Capacitor)

---

## 9. Tests

### 9.1 Couverture

- **Unitaires (Vitest)** : services crypto/profile/permissions ≥ 80%
- **E2E (Playwright)** : 10 scénarios P0
- **Tests de sécurité** : injection, bruteforce password, rules Firestore

### 9.2 Scénarios E2E critiques

1. Signup → 2FA → login → logout → relogin
2. Créer profil complet → configurer permissions par catégorie
3. Générer QR pour "Amis" → vérifier que seuls les champs autorisés sont encodés
4. Scanner QR → ajouter contact dans catégorie Famille
5. Essai gratuit 30j actif au 1er lancement
6. Upgrade Free → Plus via Stripe (mode test)
7. Suppression de compte → données supprimées partout
8. Export JSON → fichier valide
9. 2FA désactivation avec confirmation password
10. Permissions modifiées → contacts scannés après voient les nouvelles permissions

---

## 10. Déploiement

### 10.1 Environnements

| Env | URL |
|---|---|
| dev | localhost:3030 |
| prod | `land-lang-120.github.io/switchr/` → PWA |
| Android | Play Store (TWA AAB) |
| iOS | App Store (Capacitor) |

### 10.2 Pipeline

- GitHub Actions : lint + typecheck + tests unit + build + E2E + deploy GitHub Pages
- Workflow séparé APK Android (comme Chrome Messenger)

---

## 11. Métriques & KPI

| Métrique | Cible 3 mois | Cible 12 mois |
|---|---|---|
| Installations | 5 000 | 50 000 |
| DAU | 500 | 10 000 |
| Conversion Free → Plus | 3% | 5% |
| Conversion Plus → Pro | 10% | 15% |
| Rétention J30 | 25% | 35% |
| Transferts par mois (Pro) | 200 | 5 000 |
| QR scanné / user / mois | 3 | 8 |

---

## 12. Risques

| Risque | Impact | Mitigation |
|---|---|---|
| Permissions OS refusées (caméra, stockage) | Élevé | Messages clairs + fallback manuel |
| Stockage temporaire Firebase trop cher si scale | Élevé | Limite 5 Go/transfert, auto-delete 24h, migration S3 si succès |
| Concurrence (Google Contacts améliore) | Moyen | Différenciation sur permissions granulaires |
| Bug pendant transfert → perte de données | Élevé | Resumable uploads (tus.io ou Firebase native), checksum |
| QR injection malveillant | Moyen | Validation stricte du schéma JSON encodé |

---

## 13. Budget dev

| Poste | Estimation |
|---|---|
| Firebase Blaze (5000 users) | ~30 €/mois |
| Stripe (commission) | 1.4% + 0.25 €/transaction |
| Domaine `.app` | ~15 €/an |
| Play Console + App Store | 25 € + 99 €/an |
| Design / illustrations | 0 (logo fourni) |
| **Total démarrage** | ~200 € |

---

## 14. Validation

Ce cahier des charges est rédigé le 2026-04-20 suite aux specs directes de Pino :
- App de switch de téléphone + échange intelligent de contacts
- 3 plans Free/Plus(2.99$)/Pro(6.99$)
- Permissions par catégorie
- Authentification avec nom + password + 2FA optionnelle
- Logo fourni (bleu)
