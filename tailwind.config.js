/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'collapse-spin': 'collapseSpin 1.2s ease-in-out forwards',
        'expand-flash': 'expandFlash 1s ease-out forwards',
        'expand-surge': 'expandSurge 2s ease-out forwards',
        'idle-rotate-pulse': 'idleRotatePulse 10s linear infinite',
        'swirlPulse': 'swirlPulse 2s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
      },
      keyframes: {
        swirlPulse: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '0.5' },
          '50%': { transform: 'scale(1.2) rotate(720deg)', opacity: '0.8' },
          '100%': { transform: 'scale(1.5) rotate(1440deg)', opacity: '0.5' },
        },
        idleRotatePulse: {
          '0%': { transform: 'rotate(0deg) scale(1)', opacity: '0.4' },
          '50%': { transform: 'rotate(180deg) scale(1.05)', opacity: '0.6' },
          '100%': { transform: 'rotate(360deg) scale(1)', opacity: '0.4' },
        },
        expandSurge: {
          '0%': { transform: 'scale(0.2) rotate(0deg)', opacity: '0.2' },
          '50%': { transform: 'scale(1.2) rotate(360deg)', opacity: '0.6' },
          '100%': { transform: 'scale(1) rotate(720deg)', opacity: '0.4' },
        },
        collapseSpin: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '0.5' },
          '100%': { transform: 'scale(0) rotate(720deg)', opacity: '0' },
        },
        expandFlash: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '70%': { transform: 'scale(1.3) rotate(720deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(1080deg)', opacity: '0.4' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
