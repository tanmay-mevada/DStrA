// tailwind.config.js
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#38bdf8",
        darkPrimary: "#0ea5e9",
        background: "#f9fafb",
        backgroundDark: "#0f172a",
        surface: "#e2e8f0",
        surfaceDark: "#1e293b",
        text: "#111827",
        textDark: "#e2e8f0",
        borderL: "#64748b",
        borderDark: "#334155",
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-in-out",
        fade: "fadeOut 6s ease-in-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "70%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      },
       fontFamily: {
        michroma: ['"Michroma"', 'sans-serif'],
        techmono: ['"Share Tech Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
