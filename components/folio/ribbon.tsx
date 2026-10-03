/*
 * The silk ribbon behind the hero, after the one on Stripe's own pages: a
 * filled band of warm-to-cool gradient with fine thread lines over it.
 * Drawn as SVG from computed curves (no image, no client JS), so it stays
 * sharp at every size and costs nothing to load.
 */

const N = 44;

type Pt = [number, number];

function strand(t: number): [Pt, Pt, Pt, Pt] {
  return [
    [60 + 300 * t, 1060],
    [430 + 150 * t, 780 - 160 * t],
    [560 + 60 * t, 300 + 120 * t],
    [1260, -80 + 300 * t],
  ];
}

const f = (n: number) => n.toFixed(1);
const curve = ([a, b, c, d]: [Pt, Pt, Pt, Pt]) =>
  `M${f(a[0])} ${f(a[1])}C${f(b[0])} ${f(b[1])} ${f(c[0])} ${f(c[1])} ${f(d[0])} ${f(d[1])}`;

export function Ribbon({ id = "fo-rb", className = "fo-ribbon" }: { id?: string; className?: string }) {
  const first = strand(0);
  const last = strand(1);
  const band =
    `${curve(first)}L${f(last[3][0])} ${f(last[3][1])}` +
    `C${f(last[2][0])} ${f(last[2][1])} ${f(last[1][0])} ${f(last[1][1])} ${f(last[0][0])} ${f(last[0][1])}Z`;

  const threads = Array.from({ length: N }, (_, i) => curve(strand(i / (N - 1))));

  return (
    <svg className={className} viewBox="0 0 1200 1000" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1="140" y1="1000" x2="1220" y2="0">
          <stop offset="0" stopColor="#a8b8ff" />
          <stop offset="0.24" stopColor="#ffc35c" />
          <stop offset="0.46" stopColor="#ff8a3d" />
          <stop offset="0.66" stopColor="#ff5f9e" />
          <stop offset="0.84" stopColor="#b36bff" />
          <stop offset="1" stopColor="#6e6bff" />
        </linearGradient>
        <filter id={`${id}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <path d={band} fill={`url(#${id}-g)`} filter={`url(#${id}-soft)`} opacity="0.95" />
      <g fill="none" stroke={`url(#${id}-g)`} strokeWidth="5" opacity="0.6">
        {threads.map((d, i) => (i % 2 === 0 ? <path key={i} d={d} /> : null))}
      </g>
      <g fill="none" stroke="#ffffff" strokeWidth="0.9" opacity="0.32">
        {threads.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
