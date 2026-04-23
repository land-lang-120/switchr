/** Input Switchr — controle simple avec label optionnel + erreur. */

import type { CSSProperties } from 'react';

export interface InputProps {
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly placeholder?: string;
  readonly type?: 'text' | 'email' | 'tel' | 'password' | 'url';
  readonly label?: string;
  readonly error?: string;
  readonly maxLength?: number;
  readonly autoFocus?: boolean;
  readonly autoComplete?: string;
}

export function Input(p: InputProps) {
  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    border: `1.5px solid ${p.error ? 'var(--sw-danger)' : 'var(--sw-line)'}`,
    background: 'var(--sw-surface)',
    color: 'var(--sw-title)',
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {p.label && (
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--sw-sub)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
          {p.label}
        </label>
      )}
      <input
        value={p.value}
        onChange={(e) => p.onChange(e.target.value)}
        placeholder={p.placeholder}
        type={p.type ?? 'text'}
        maxLength={p.maxLength}
        autoFocus={p.autoFocus}
        autoComplete={p.autoComplete}
        style={inputStyle}
      />
      {p.error && <span style={{ fontSize: 12, color: 'var(--sw-danger)', fontWeight: 600 }}>{p.error}</span>}
    </div>
  );
}
