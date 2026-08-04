import './AppLogo.css'

export function AppLogo() {
  return (
    <svg className="app-logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="authFlowLogoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="55%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      <circle cx="25" cy="19" r="11" fill="url(#authFlowLogoGradient)" />
      <path
        d="M7 53c0-11.6 8.2-19 18-19s18 7.4 18 19"
        fill="none"
        stroke="url(#authFlowLogoGradient)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <g transform="translate(33,31)">
        <circle cx="15" cy="15" r="15" fill="#121212" />
        <path
          d="M9 13v-2a6 6 0 0 1 12 0v2"
          fill="none"
          stroke="url(#authFlowLogoGradient)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <rect x="6" y="13" width="18" height="13" rx="3" fill="url(#authFlowLogoGradient)" />
        <path d="M11 19.5l2.6 2.6L20 16" fill="none" stroke="#121212" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}
