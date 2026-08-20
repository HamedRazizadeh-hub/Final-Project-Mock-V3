type MarkProps = { size?: number; tone?: 'brand' | 'mono' | 'white' | 'quiet' };

const LEFT = 'M15 5H10a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h5Z';
const RIGHT = 'M17 7h5a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5h-5Z';

const TONES: Record<NonNullable<MarkProps['tone']>, [string, string, number]> = {
  brand: ['#3E1F35', '#6B3A5E', 1],
  mono: ['#1A1614', '#1A1614', 0.45],
  white: ['#FAF7F2', '#FAF7F2', 0.6],
  quiet: ['#8C8379', '#C0B7AA', 1],
};

/**
 * The JobMatch mark: two halves of one form, one still sliding into alignment.
 * Full asset set (incl. outlined wordmark SVGs) lives in /public/brand.
 */
export function Mark({ size = 24, tone = 'brand' }: MarkProps) {
  const [a, b, opacity] = TONES[tone];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      style={{ display: 'block', flex: '0 0 auto' }}
    >
      <path d={LEFT} fill={a} />
      <path d={RIGHT} fill={b} opacity={opacity} />
    </svg>
  );
}
