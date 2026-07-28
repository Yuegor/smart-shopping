/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        paper: '#FAF7F2',
        ink: '#1F2A22',
        surface: '#FFFFFF',
        muted: '#8B9A8F',
        line: '#E4DED2',
        moss: {
          DEFAULT: '#2F6F4E',
          dark: '#24573D',
          light: '#EAF3EC'
        },
        amber: {
          DEFAULT: '#E8A33D',
          dark: '#C9852A'
        },
        // dark theme surface set
        night: {
          bg: '#141815',
          surface: '#1E2420',
          ink: '#EDF1EC',
          muted: '#5C6B60',
          line: '#2A322C'
        },
        mint: {
          DEFAULT: '#6FCF97',
          dark: '#4FAE78'
        }
      },
      borderRadius: {
        tag: '18px'
      },
      boxShadow: {
        tag: '0 1px 2px rgba(31, 42, 34, 0.06), 0 6px 16px rgba(31, 42, 34, 0.06)',
        'tag-dark': '0 1px 2px rgba(0,0,0,0.3), 0 6px 16px rgba(0,0,0,0.35)'
      },
      keyframes: {
        stamp: {
          '0%': { transform: 'scale(0.6) rotate(-14deg)', opacity: '0' },
          '60%': { transform: 'scale(1.15) rotate(4deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        stamp: 'stamp 0.35s cubic-bezier(.2,1.4,.4,1)',
        pop: 'pop 0.2s ease-out'
      }
    }
  },
  plugins: []
}
