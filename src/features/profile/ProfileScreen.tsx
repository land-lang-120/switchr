/**
 * ProfileScreen — edition des champs du profil + permissions par categorie.
 *
 * Section 1 : Champs (numero, WhatsApp, Insta, ...). Tous editables.
 * Section 2 : Pour chaque categorie de contact, on coche les champs partageables.
 *
 * Les modifs sont sauvegardees en localStorage via authSvc.updateCurrentUser.
 */

import { useMemo, useState } from 'react';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import { updateCurrentUser } from '../../services/auth';
import {
  CATEGORY_LABELS,
  CONTACT_CATEGORIES,
  FIELD_META,
  PROFILE_FIELD_KEYS,
  type ContactCategory,
  type ProfileFieldKey,
} from '../../types/contact';
import type { Profile } from '../../types/user';

export interface ProfileScreenProps {
  readonly onBack: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { user, refresh } = useAuth();
  if (!user) return null;

  // Local draft du profil — sauvegarde au clic Enregistrer
  const [draft, setDraft] = useState<Profile>(user.profile);
  const [savedToast, setSavedToast] = useState(false);
  const [tab, setTab] = useState<'fields' | 'permissions'>('fields');

  const isProUser = user.plan !== 'free';

  function setField(key: ProfileFieldKey, value: string) {
    setDraft((d) => ({
      ...d,
      fields: { ...d.fields, [key]: value },
    }));
  }

  function togglePermission(cat: ContactCategory, key: ProfileFieldKey) {
    setDraft((d) => {
      const current = d.permissionsByCategory[cat] ?? [];
      const has = current.includes(key);
      const next = has ? current.filter((k) => k !== key) : [...current, key];
      return {
        ...d,
        permissionsByCategory: { ...d.permissionsByCategory, [cat]: next },
      };
    });
  }

  function save() {
    updateCurrentUser({ profile: draft });
    refresh();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  }

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(user.profile), [draft, user.profile]);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 18 }}>
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
          Mon profil
        </h1>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--sw-surface)', borderRadius: 14 }}>
        {([
          { id: 'fields' as const, label: 'Mes champs' },
          { id: 'permissions' as const, label: 'Permissions' },
        ]).map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: '10px 12px', borderRadius: 10,
                background: active ? 'var(--sw-primary)' : 'transparent',
                color: active ? '#FFF' : 'var(--sw-title)',
                border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'fields' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PROFILE_FIELD_KEYS.map((key) => {
            const meta = FIELD_META[key];
            const locked = meta.proOnly && !isProUser;
            return (
              <div key={key} style={{ position: 'relative', opacity: locked ? 0.55 : 1 }}>
                <Input
                  label={`${meta.emoji} ${meta.labelFr}${meta.proOnly ? ' (Pro)' : ''}`}
                  value={draft.fields[key] ?? ''}
                  onChange={(v) => setField(key, v)}
                  type={meta.type === 'textarea' ? 'text' : meta.type}
                  placeholder={locked ? 'Reserve aux comptes Pro' : meta.labelFr}
                  maxLength={key === 'bio' ? 280 : 200}
                />
                {locked && (
                  <span style={{ position: 'absolute', right: 12, top: 38, fontSize: 16 }} aria-hidden>
                    🔒
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'permissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <p style={{ fontSize: 13, color: 'var(--sw-sub)', lineHeight: 1.4 }}>
            Pour chaque categorie de contact, coche les champs que tu acceptes de partager.
          </p>
          {CONTACT_CATEGORIES.map((cat) => {
            const meta = CATEGORY_LABELS[cat];
            const granted = draft.permissionsByCategory[cat] ?? [];
            return (
              <section key={cat} style={{ background: 'var(--sw-surface)', borderRadius: 16, padding: 14 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--sw-title)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span aria-hidden>{meta.emoji}</span> {meta.labelFr}
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--sw-sub)', fontWeight: 600 }}>
                    {granted.length}/{PROFILE_FIELD_KEYS.length}
                  </span>
                </h3>
                <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {PROFILE_FIELD_KEYS.map((key) => {
                    const checked = granted.includes(key);
                    const fieldMeta = FIELD_META[key];
                    return (
                      <label
                        key={key}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '8px 10px', borderRadius: 10,
                          background: checked ? 'var(--sw-primary-soft)' : 'var(--sw-bg)',
                          border: `1px solid ${checked ? 'var(--sw-primary)' : 'var(--sw-line)'}`,
                          cursor: 'pointer', fontSize: 12, fontWeight: 600,
                          color: checked ? 'var(--sw-primary-dark)' : 'var(--sw-title)',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePermission(cat, key)}
                          style={{ accentColor: 'var(--sw-primary)' }}
                        />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {fieldMeta.emoji} {fieldMeta.labelFr}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Footer fixe : bouton enregistrer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 20px calc(20px + env(safe-area-inset-bottom))', background: 'var(--sw-bg)', borderTop: '1px solid var(--sw-line)' }}>
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
          <Button variant="primary" fullWidth onClick={save} disabled={!dirty}>
            {savedToast ? '✓ Enregistre' : dirty ? 'Enregistrer les modifs' : 'Aucun changement'}
          </Button>
        </div>
      </div>
    </div>
  );
}
