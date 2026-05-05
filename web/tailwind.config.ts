import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
      },
      colors: {
        // Cappuccino-Palette: warme Beige/Braun-Töne
        crema: {
          50: "#fbf6ef",
          100: "#f4ead7",
          200: "#e9d4ae",
          300: "#dbb87e",
          400: "#c99a55",
          500: "#b6803e",
          600: "#9c6730",
          700: "#7d4f29",
          800: "#634025",
          900: "#503521",
          950: "#2c1c11",
        },
        espresso: {
          50: "#f5f0eb",
          100: "#e7dcd0",
          200: "#cdb6a1",
          300: "#a98768",
          400: "#7e5c3d",
          500: "#5b3f29",
          600: "#432c1d",
          700: "#352116",
          800: "#291911",
          900: "#1c110a",
          950: "#0e0805",
        },
        milk: {
          50: "#fefcfa",
          100: "#fcf7f1",
          200: "#f7ebd9",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(80,53,33,.04), 0 8px 24px rgba(80,53,33,.06)",
        liftn: "0 12px 32px rgba(28,17,10,.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [typography],
};

export default config;
