/** Bouton Switchr — variants primary / ghost / danger. */

import type { CSSProperties } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';

export interface ButtonProps {
  readonly children: React.ReactNode;
  readonly onClick?: () => void;
  readonly variant?: Variant;
  readonly disabled?: boolean;
  readonly fullWidth?: boolean;
  readonly type?: 'button' | 'submit';
}

export function Button({ children, onClick, variant = 'primary', disabled, fullWidth, type = 'button' }: ButtonProps) {
  const base: CSSProperties = {
    padding: '14px 22px',
    borderRadius: 16,
    border: 'none',
    fontSize: 15,
    fontWeight: 700,
    fontFamily: 'inherit',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
    transition: 'transform 100ms',
  };
  const variants: Record<Variant, CSSProperties> = {
    primary: { background: 'var(--sw-primary)', color: '#FFF' },
    ghost:   { background: 'var(--sw-surface)', color: 'var(--sw-title)', border: '1px solid var(--sw-line)' },
    danger:  { background: 'var(--sw-danger)', color: '#FFF' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}
