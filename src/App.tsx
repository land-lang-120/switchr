/**
 * Switchr — racine de l'app.
 *
 * Router state-based (pas de lib externe) — Welcome / Signup / Login / Home /
 * placeholders pour Profile / Exchange / Contacts / Transfer.
 *
 * Si aucun user n'est loggue, on tape direct sur Welcome.
 */

import { useState } from 'react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ExchangeScreen } from './features/exchange/ExchangeScreen';
import { HomeScreen } from './features/home/HomeScreen';
import { LoginScreen } from './features/onboarding/LoginScreen';
import { SignupScreen } from './features/onboarding/SignupScreen';
import { WelcomeScreen } from './features/onboarding/WelcomeScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';

type View =
  | { kind: 'welcome' }
  | { kind: 'signup' }
  | { kind: 'login' }
  | { kind: 'home' }
  | { kind: 'profile' }
  | { kind: 'exchange' }
  | { kind: 'contacts' }
  | { kind: 'transfer' };

function Shell() {
  const { user } = useAuth();
  const [view, setView] = useState<View>({ kind: user ? 'home' : 'welcome' });

  // Placeholder simple pour les ecrans pas encore construits
  const ComingSoon = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <button
        type="button"
        onClick={onBack}
        style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: 'var(--sw-sub)', fontSize: 14, fontWeight: 600, padding: 0, cursor: 'pointer' }}
      >
        ← Retour
      </button>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }} aria-hidden>🚧</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--sw-title)' }}>{title}</h1>
        <p style={{ fontSize: 14, color: 'var(--sw-sub)', maxWidth: 280 }}>
          Cette section arrive dans la prochaine session. Le scaffold est en place.
        </p>
      </div>
    </div>
  );

  // Si user disparait (logout), retourner sur welcome automatiquement
  if (!user && view.kind !== 'welcome' && view.kind !== 'signup' && view.kind !== 'login') {
    setView({ kind: 'welcome' });
    return null;
  }

  switch (view.kind) {
    case 'welcome':
      return (
        <WelcomeScreen
          onSignup={() => setView({ kind: 'signup' })}
          onLogin={() => setView({ kind: 'login' })}
        />
      );
    case 'signup':
      return (
        <SignupScreen
          onBack={() => setView({ kind: 'welcome' })}
          onDone={() => setView({ kind: 'home' })}
        />
      );
    case 'login':
      return (
        <LoginScreen
          onBack={() => setView({ kind: 'welcome' })}
          onDone={() => setView({ kind: 'home' })}
        />
      );
    case 'home':
      return (
        <HomeScreen
          onOpenProfile={() => setView({ kind: 'profile' })}
          onOpenExchange={() => setView({ kind: 'exchange' })}
          onOpenContacts={() => setView({ kind: 'contacts' })}
          onOpenTransfer={() => setView({ kind: 'transfer' })}
        />
      );
    case 'profile':
      return <ProfileScreen onBack={() => setView({ kind: 'home' })} />;
    case 'exchange':
      return <ExchangeScreen onBack={() => setView({ kind: 'home' })} />;
    case 'contacts':
      return <ComingSoon title="Scanner + contacts recus" onBack={() => setView({ kind: 'home' })} />;
    case 'transfer':
      return <ComingSoon title="Transfert telephone-telephone" onBack={() => setView({ kind: 'home' })} />;
  }
}

export function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
