/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#38bdf8',
        darkPrimary: '#0ea5e9',
        background: '#f9fafb',
        backgroundDark: '#0f172a',
        surface: '#ffffff',
        surfaceDark: '#1e293b',
        text: '#111827',
        textDark: '#e2e8f0',
        border: '#000000',
        borderDark: '#334155',
      },
    },
    extend: {
  animation: {
    fadeIn: 'fadeIn 0.4s ease-in-out',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
  },
},

  },
  plugins: [],
};
