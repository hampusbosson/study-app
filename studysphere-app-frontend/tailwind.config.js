/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f4f7fb",
        backgroundOverlay: "#ffffffb3",
        card: "#ffffff",
        surface: "#ffffff",
        surfaceAlt: "#eef4ff",
        border: "#d8e1f0",
        text: "#0f172a",
        muted: "#64748b",
        accent: "#2563eb",
        accentHover: "#1d4ed8",
        accentSoft: "#dbeafe",
        silver: "#e2e8f0",
      },
      backgroundImage: {
        "accent-gradient":
          "linear-gradient(135deg, #60a5fa 0%, #2563eb 55%, #0f172a 100%)",
        "shiny-silver": "linear-gradient(90deg, #64748b, #0f172a, #64748b)",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
      },
      fontWeight: {
        hairline: 100,
        'extra-light': 100,
        thin: 200,
         light: 300,
         normal: 400,
         medium: 500,
        semibold: 600,
         bold: 700,
        extrabold: 800,
        'extra-bold': 800,
         black: 900,
       },
       boxShadow: {
        "glow-accent": "0 18px 40px rgba(37, 99, 235, 0.18)",
        "glow-accent-active": "0 22px 50px rgba(37, 99, 235, 0.24)",
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        "html, body": { fontFamily: "raleway, sans-serif" },
      });
    },
    tailwindScrollbar({ nocompatible: true }),
  ],
};
