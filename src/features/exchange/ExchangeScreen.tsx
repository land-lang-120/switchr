/**
 * ExchangeScreen — genere un QR code d'echange filtre par categorie.
 *
 * 1. L'user choisit la categorie qu'il assigne au destinataire (Famille, Ami, Collegue...)
 * 2. On filtre profile.fields par profile.permissionsByCategory[categorie]
 * 3. On serialise un ExchangePayload v1 et on encode en QR (lib `qrcode`)
 * 4. Affichage QR + "share" du payload (copy / save image)
 */

import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';

import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import {
  CATEGORY_LABELS,
  CONTACT_CATEGORIES,
  type ContactCategory,
} from '../../types/contact';
import type { ExchangePayload } from '../../types/exchange';
import { colorFromName } from '../../utils/crypto';

export interface ExchangeScreenProps {
  readonly onBack: () => void;
}

export function ExchangeScreen({ onBack }: ExchangeScreenProps) {
  const { user } = useAuth();
  const [category, setCategory] = useState<ContactCategory>('friends');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Construit le payload filtre
  const payload = useMemo<ExchangePayload | null>(() => {
    if (!user) return null;
    const granted = user.profile.permissionsByCategory[category] ?? [];
    const filteredFields: Partial<Record<string, string>> = {};
    for (const key of granted) {
      const value = user.profile.fields[key];
      if (value && value.trim()) filteredFields[key] = value;
    }
    return {
      v: 1,
      kind: 'contact-exchange',
      fullName: user.fullName,
      categoryForMe: category,
      fields: filteredFields,
      customFields: user.profile.customFields.map((f) => ({ key: f.key, value: f.value })),
      issuedAtMs: Date.now(),
      issuerAvatarHex: colorFromName(user.fullName),
    };
  }, [user, category]);

  // Genere le QR data URL a chaque changement de categorie
  useEffect(() => {
    if (!payload) return;
    const text = JSON.stringify(payload);
    QRCode.toDataURL(text, { width: 320, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#0F1620', light: '#FFFFFF' } })
      .then(setQrDataUrl)
      .catch((err) => {
        console.error('[exchange] QR gen failed:', err);
        setQrDataUrl('');
      });
  }, [payload]);

  if (!user) return null;

  const sharedCount = payload ? Object.keys(payload.fields).length + payload.customFields.length : 0;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Retour"
          style={{ background: 'transparent', border: 'none', color: 'var(--sw-sub)', fontSize: 14, fontWeight: 600, padding: 0, cursor: 'pointer' }}
        >
          ← Retour
        </button>
        <h1 style={{ flex: 1, fontSize: 20, fontWeight: 800, color: 'var(--sw-title)', textAlign: 'center', marginRight: 56 }}>
          Mon QR d&apos;echange
        </h1>
      </header>

      <p style={{ fontSize: 13, color: 'var(--sw-sub)', lineHeight: 1.4, textAlign: 'center' }}>
        Choisis la categorie de la personne en face.
        Elle ne recevra que les champs autorises pour cette categorie.
      </p>

      {/* Categorie picker */}
      <div className="sw-scroll-x" style={{ display: 'flex', gap: 8, padding: '4px 0' }}>
        {CONTACT_CATEGORIES.map((cat) => {
          const meta = CATEGORY_LABELS[cat];
          const active = category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '10px 16px', borderRadius: 999,
                background: active ? 'var(--sw-primary)' : 'var(--sw-surface)',
                color: active ? '#FFF' : 'var(--sw-title)',
                border: active ? 'none' : '1px solid var(--sw-line)',
                cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              <span aria-hidden>{meta.emoji}</span> {meta.labelFr}
            </button>
          );
        })}
      </div>

      {/* QR preview */}
      <div
        style={{
          margin: '0 auto', padding: 18,
          background: '#FFFFFF', borderRadius: 24,
          border: '1px solid var(--sw-line)',
          boxShadow: '0 12px 32px rgba(15,22,32,0.06)',
        }}
      >
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR d'echange" width={280} height={280} style={{ display: 'block' }} />
        ) : (
          <div style={{ width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sw-muted)', fontSize: 13 }}>
            Generation...
          </div>
        )}
      </div>

      {/* Resume du contenu partage */}
      <section style={{ background: 'var(--sw-surface)', borderRadius: 16, padding: 14 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--sw-sub)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
          Champs envoyes
        </h2>
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--sw-title)', fontWeight: 700 }}>
          {sharedCount} champ{sharedCount > 1 ? 's' : ''} partage{sharedCount > 1 ? 's' : ''}
        </p>
        {sharedCount === 0 && (
          <p style={{ marginTop: 6, fontSize: 12, color: 'var(--sw-warning)' }}>
            ⚠️ Aucun champ a partager pour cette categorie. Verifie tes permissions dans Mon profil.
          </p>
        )}
      </section>

      <div style={{ flex: 1 }} />

      <Button
        variant="ghost"
        fullWidth
        onClick={() => {
          if (qrDataUrl) {
            const a = document.createElement('a');
            a.href = qrDataUrl;
            a.download = `switchr-${user.fullName.replace(/\s+/g, '_')}-${category}.png`;
            a.click();
          }
        }}
        disabled={!qrDataUrl}
      >
        💾 Telecharger le QR
      </Button>
    </div>
  );
}
