// A tiny hand-picked icon set so we don't need an icon library dependency.
// Each icon is a plain 24x24 stroke-based SVG that inherits currentColor.
export default function Icon({ name, className = 'w-5 h-5', strokeWidth = 2 }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className
  }

  switch (name) {
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      )
    case 'forward':
      return (
        <svg {...common}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      )
    case 'close':
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      )
    case 'back':
      return (
        <svg {...common}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      )
    case 'trash':
      return (
        <svg {...common}>
          <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13" />
        </svg>
      )
    case 'check':
      return (
        <svg {...common}>
          <path d="M4 12l5 5L20 6" />
        </svg>
      )
    case 'basket':
      return (
        <svg {...common}>
          <path d="M4 10h16l-1.5 9.2a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 10Z" />
          <path d="M8 10V8a4 4 0 0 1 8 0v2" />
        </svg>
      )
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )
    case 'moon':
      return (
        <svg {...common}>
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
        </svg>
      )
    case 'grip':
      return (
        <svg {...common}>
          <circle cx="9" cy="6" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="9" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="9" cy="18" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="6" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="18" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'chevron-down':
      return (
        <svg {...common}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      )
    case 'undo':
      return (
        <svg {...common}>
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10a6 6 0 0 1 0 12h-1" />
        </svg>
      )
    case 'list':
      return (
        <svg {...common}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      )
    case 'bread':
      return (
        <svg {...common}>
          <path d="M4 13c0-3.5 3.5-7 8-7s8 3.5 8 7-2 6-8 6-8-2.5-8-6Z" />
          <path d="M8 9.5c1 1 1 3 0 4M12 8c1 1.2 1 3.8 0 5M16 9.5c1 1 1 3 0 4" />
        </svg>
      )
    case 'meat':
      return (
        <svg {...common}>
          <path d="M9 4c4 0 8 3 8 7.5S15 20 10.5 20A5.5 5.5 0 0 1 5 14.5 4.5 4.5 0 0 1 9 10" />
          <path d="M5 14.5 3 19M9 10a3 3 0 0 1 0-6" />
        </svg>
      )
    case 'pill':
      return (
        <svg {...common}>
          <rect x="3.5" y="9" width="17" height="6" rx="3" transform="rotate(-45 12 12)" />
          <path d="M12 12 8.5 15.5" />
        </svg>
      )
    case 'camera':
      return (
        <svg {...common}>
          <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
          <circle cx="12" cy="13.5" r="3.2" />
        </svg>
      )
    case 'card':
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="2.2" />
          <path d="M3 10h18" />
          <path d="M6.5 14h3" />
        </svg>
      )
    case 'package':
      return (
        <svg {...common}>
          <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
          <path d="M4 7l8 4 8-4M12 11v10" />
        </svg>
      )
    case 'store':
      return (
        <svg {...common}>
          <path d="M3 9l1.5-5h15L21 9" />
          <path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
          <path d="M4 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
        </svg>
      )
    default:
      return null
  }
}
