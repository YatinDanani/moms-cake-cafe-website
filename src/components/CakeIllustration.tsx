export function CakeIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 420"
      className={className}
      role="img"
      aria-label="Illustration of a two-tier layer cake with a lit candle"
    >
      <ellipse cx="210" cy="372" rx="150" ry="18" fill="#2E1D14" opacity="0.08" />

      {/* plate */}
      <ellipse cx="210" cy="352" rx="168" ry="20" fill="#EBDFC7" />
      <ellipse cx="210" cy="348" rx="168" ry="20" fill="#FAF2E6" stroke="#2E1D14" strokeOpacity="0.1" strokeWidth="2" />

      {/* bottom tier */}
      <rect x="90" y="248" width="240" height="100" rx="14" fill="#7A4B26" />
      <rect x="90" y="248" width="240" height="22" rx="11" fill="#FAF2E6" opacity="0.9" />
      {Array.from({ length: 11 }).map((_, i) => (
        <circle key={`b-${i}`} cx={104 + i * 21.5} cy={259} r="6.5" fill="#7A4B26" />
      ))}

      {/* bottom tier drip */}
      <path
        d="M90 270 q12 26 24 0 q12 26 24 0 q12 26 24 0 q12 26 24 0 q12 26 24 0 q12 26 24 0 q12 26 24 0 q12 26 24 0 q12 26 24 0 q12 26 24 0 L330 270 Z"
        fill="#FAF2E6"
        opacity="0.9"
      />

      {/* top tier */}
      <rect x="132" y="150" width="156" height="98" rx="14" fill="#B98A52" />
      <rect x="132" y="150" width="156" height="20" rx="10" fill="#FAF2E6" opacity="0.9" />
      {Array.from({ length: 7 }).map((_, i) => (
        <circle key={`t-${i}`} cx={146 + i * 21} cy={160} r="6" fill="#B98A52" />
      ))}

      {/* mocha piping dots along top tier base */}
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={`p-${i}`} cx={150 + i * 24} cy={246} r="5" fill="#5B4334" />
      ))}

      {/* candle */}
      <rect x="200" y="104" width="12" height="48" rx="4" fill="#D9BC8C" />
      <path d="M200 110 l12 0 l-6 10 Z" fill="#FAF2E6" opacity="0.6" />
      <path
        d="M206 86 c8 10 8 18 0 26 c-8 -8 -8 -16 0 -26 Z"
        fill="#B98A52"
      />
      <path
        d="M206 94 c5 6 5 11 0 16 c-5 -5 -5 -10 0 -16 Z"
        fill="#7A4B26"
      />
    </svg>
  );
}
