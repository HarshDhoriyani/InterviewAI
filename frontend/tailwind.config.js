/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sora)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-clash)', 'sans-serif'],
      },
      colors: {
        ink: {
          50:  '#f4f3f0',
          100: '#e8e6e1',
          200: '#d1cdc4',
          300: '#b5afa3',
          400: '#958d80',
          500: '#7a7167',
          600: '#635a51',
          700: '#504942',
          800: '#443e38',
          900: '#3b352f',
          950: '#0d0b09',
        },
        gold: {
          300: '#e8c97a',
          400: '#d4a843',
          500: '#b8891e',
          600: '#9a6f0f',
        },
        surface: {
          0:   '#0a0908',
          1:   '#111009',
          2:   '#18160f',
          3:   '#201e15',
          4:   '#28251b',
        },
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
      },
      boxShadow: {
        'gold': '0 0 40px rgba(212, 168, 67, 0.15)',
        'inner-gold': 'inset 0 1px 0 rgba(212, 168, 67, 0.2)',
      },
    },
  },
  plugins: [],
};