/** Login — formulaire connexion compte existant. */

import { useState } from 'react';
import { ZodError } from 'zod';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';

export interface LoginScreenProps {
  readonly onBack: () => void;
  readonly onDone: () => void;
}

interface Errors { fullName?: string; password?: string; general?: string }

export function LoginScreen({ onBack, onDone }: LoginScreenProps) {
  const { login, loading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  async function submit() {
    setErrors({});
    try {
      await login({ fullName: fullName.trim(), password });
      onDone();
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Errors = {};
        for (const issue of err.errors) {
          const path = issue.path[0] as keyof Errors;
          if (path) fieldErrors[path] = issue.message;
        }
        setErrors(fieldErrors);
      } else if ((err as { code?: string }).code === 'bad-credentials') {
        setErrors({ general: 'Identifiants invalides.' });
      } else {
        setErrors({ general: (err as Error).message });
      }
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <button
        type="button"
        onClick={onBack}
        style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: 'var(--sw-sub)', fontSize: 14, fontWeight: 600, padding: 0, cursor: 'pointer' }}
      >
        ← Retour
      </button>

      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--sw-title)' }}>Bon retour</h1>
        <p style={{ fontSize: 14, color: 'var(--sw-sub)', marginTop: 6 }}>Entre ton nom et ton mot de passe.</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); void submit(); }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <Input
          label="Nom complet"
          value={fullName}
          onChange={setFullName}
          placeholder="Pino Lando"
          error={errors.fullName}
          autoFocus
          autoComplete="name"
        />
        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Mot de passe"
          error={errors.password}
          autoComplete="current-password"
        />
        {errors.general && (
          <p style={{ fontSize: 13, color: 'var(--sw-danger)', fontWeight: 600 }}>{errors.general}</p>
        )}
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </div>
  );
}
