/** Home — dashboard apres login. Placeholder fonctionnel pour MVP. */

import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { colorFromName } from '../../utils/crypto';

export interface HomeScreenProps {
  readonly onOpenProfile: () => void;
  readonly onOpenExchange: () => void;
  readonly onOpenContacts: () => void;
  readonly onOpenTransfer: () => void;
}

export function HomeScreen({ onOpenProfile, onOpenExchange, onOpenContacts, onOpenTransfer }: HomeScreenProps) {
  const { user, logout } = useAuth();
  if (!user) return null;
  const avatarColor = colorFromName(user.fullName);
  const initials = user.fullName.split(' ').map((p) => p.charAt(0)).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={36} />
        <button
          type="button"
          onClick={onOpenProfile}
          aria-label="Profil"
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: avatarColor, color: '#FFF',
            border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 800, fontFamily: 'inherit',
          }}
        >
          {initials || '?'}
        </button>
      </header>

      {/* Greeting */}
      <div>
        <p style={{ fontSize: 14, color: 'var(--sw-sub)', fontWeight: 600 }}>Bienvenue,</p>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--sw-title)', marginTop: 4 }}>{user.fullName}</h1>
      </div>

      {/* Cards d'actions principales */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ActionCard
          emoji="🔁"
          title="Echanger"
          subtitle="Mon QR contact"
          onClick={onOpenExchange}
          accent
        />
        <ActionCard
          emoji="📷"
          title="Scanner"
          subtitle="Recevoir un contact"
          onClick={onOpenContacts}
        />
        <ActionCard
          emoji="📱"
          title="Transferer"
          subtitle="Vers nouveau telephone"
          onClick={onOpenTransfer}
          fullWidth
        />
      </div>

      {/* Stats placeholder */}
      <section style={{ background: 'var(--sw-surface)', borderRadius: 18, padding: 18 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--sw-sub)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
          Tes infos
        </h2>
        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Stat label="Plan" value={user.plan === 'free' ? 'Free' : user.plan === 'plus' ? 'Plus' : 'Pro'} />
          <Stat label="Champs" value={Object.keys(user.profile.fields).length.toString()} />
        </div>
      </section>

      <div style={{ flex: 1 }} />

      <Button variant="ghost" fullWidth onClick={logout}>Se deconnecter</Button>
    </div>
  );
}

function ActionCard({
  emoji, title, subtitle, onClick, accent, fullWidth,
}: { emoji: string; title: string; subtitle: string; onClick: () => void; accent?: boolean; fullWidth?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        gridColumn: fullWidth ? '1 / -1' : undefined,
        padding: 18,
        borderRadius: 18,
        background: accent ? 'var(--sw-primary)' : 'var(--sw-surface)',
        color: accent ? '#FFF' : 'var(--sw-title)',
        border: accent ? 'none' : '1px solid var(--sw-line)',
        cursor: 'pointer', fontFamily: 'inherit',
        textAlign: 'left',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}
    >
      <span style={{ fontSize: 26 }} aria-hidden>{emoji}</span>
      <div>
        <div style={{ fontSize: 16, fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: 12, opacity: accent ? 0.85 : 0.7, marginTop: 2 }}>{subtitle}</div>
      </div>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--sw-sub)', fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--sw-title)', marginTop: 2 }}>{value}</div>
    </div>
  );
}
