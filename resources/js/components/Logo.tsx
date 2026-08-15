export default function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" role="img" aria-label="Stackr">
      <defs>
        <linearGradient id="stackrLogo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#818cf8" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="116" fill="url(#stackrLogo)" />
      <rect x="140" y="150" width="232" height="62" rx="20" fill="#ffffff" opacity="0.5" />
      <rect x="122" y="225" width="268" height="62" rx="20" fill="#ffffff" opacity="0.78" />
      <rect x="104" y="300" width="304" height="62" rx="20" fill="#ffffff" />
    </svg>
  )
}
