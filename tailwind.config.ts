import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#16130b",
        background: "#16130b",
        obsidian: "#110e07",
        charcoal: "#231f17",
        glass: "rgba(56, 52, 43, 0.42)",
        champagne: "#f2ca50",
        gold: "#d4af37",
        rose: "#e4bfaf",
        linen: "#eae1d4",
        muted: "#d0c5af",
        outline: "#4d4635"
      },
      fontFamily: {
        serif: ["var(--font-noto-serif)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 32px rgba(212, 175, 55, 0.24)",
        soft: "0 24px 90px rgba(0, 0, 0, 0.35)"
      },
      maxWidth: {
        content: "1200px"
      }
    }
  },
  plugins: []
};

export default config;
