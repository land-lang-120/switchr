/** Welcome — premiere page (logo + pitch + CTA Signup / Login). */

import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';

export interface WelcomeScreenProps {
  readonly onSignup: () => void;
  readonly onLogin: () => void;
}

export function WelcomeScreen({ onSignup, onLogin }: WelcomeScreenProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '48px 24px 32px',
        background: 'var(--sw-bg)',
        maxWidth: 480, margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, marginTop: 40 }}>
        <Logo size={88} />
        <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--sw-title)', textAlign: 'center', lineHeight: 1.1 }}>
          Switchr
        </h1>
        <p style={{ fontSize: 16, color: 'var(--sw-sub)', textAlign: 'center', lineHeight: 1.4, maxWidth: 320 }}>
          Echange tes contacts intelligemment. Transfere ton telephone en un scan. Toi seul decides qui voit quoi.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
        <Button variant="primary" fullWidth onClick={onSignup}>Creer un compte</Button>
        <Button variant="ghost" fullWidth onClick={onLogin}>J&apos;ai deja un compte</Button>
        <p style={{ fontSize: 11, color: 'var(--sw-muted)', textAlign: 'center', marginTop: 8 }}>
          Tes donnees restent sur ton telephone. Aucun envoi serveur.
        </p>
      </div>
    </div>
  );
}
