/**
 * Switchr — Logo SVG (deux fleches qui s'echangent dans un cercle).
 * Couleur primary par defaut, override possible via prop.
 */

export interface LogoProps {
  readonly size?: number;
  readonly color?: string;
}

export function Logo({ size = 56, color = 'var(--sw-primary)' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Switchr logo">
      <circle cx={32} cy={32} r={30} fill={color} />
      {/* Deux fleches en boucle (echange) */}
      <path
        d="M20 24 H38 L34 20 M44 40 H26 L30 44"
        stroke="#FFFFFF"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
