/** Signup — formulaire creation de compte. */

import { useState } from 'react';
import { ZodError } from 'zod';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';

export interface SignupScreenProps {
  readonly onBack: () => void;
  readonly onDone: () => void;
}

interface Errors {
  fullName?: string;
  email?: string;
  password?: string;
  general?: string;
}

/** Auto-capitalize chaque mot du nom. */
function capitalizeName(s: string): string {
  return s.split(/(\s+)/).map((part) =>
    part && /\S/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part,
  ).join('');
}

export function SignupScreen({ onBack, onDone }: SignupScreenProps) {
  const { signup, loading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  async function submit() {
    setErrors({});
    try {
      await signup({ fullName: fullName.trim(), email: email.trim(), password });
      onDone();
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Errors = {};
        for (const issue of err.errors) {
          const path = issue.path[0] as keyof Errors;
          if (path) fieldErrors[path] = issue.message;
        }
        setErrors(fieldErrors);
      } else if ((err as { code?: string }).code === 'name-taken') {
        setErrors({ fullName: 'Ce nom est deja pris.' });
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
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--sw-title)' }}>Creer ton compte</h1>
        <p style={{ fontSize: 14, color: 'var(--sw-sub)', marginTop: 6 }}>Choisis ton nom, ton email, et un mot de passe solide.</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); void submit(); }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <Input
          label="Nom complet"
          value={fullName}
          onChange={(v) => setFullName(capitalizeName(v))}
          placeholder="Pino Lando"
          maxLength={60}
          error={errors.fullName}
          autoFocus
          autoComplete="name"
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="ton@email.com"
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="8+ caracteres, 1 maj, 1 chiffre"
          error={errors.password}
          autoComplete="new-password"
        />
        {errors.general && (
          <p style={{ fontSize: 13, color: 'var(--sw-danger)', fontWeight: 600 }}>{errors.general}</p>
        )}
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Creation...' : 'Creer mon compte'}
        </Button>
      </form>
    </div>
  );
}
