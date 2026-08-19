/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forty: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        heat: {
          extreme: '#ef4444',
          high: '#f97316',
          warning: '#eab308',
          moderate: '#3b82f6',
          cool: '#10b981'
        },
        dark: {
          bg: '#0b0f19',
          card: '#111827',
          cardHover: '#1f2937',
          border: '#374151',
          accent: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-orange': '0 0 20px -5px rgba(249, 115, 22, 0.4)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.5)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.4)',
        'glow-green': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 2s linear infinite',
      }
    },
  },
  plugins: [],
}
