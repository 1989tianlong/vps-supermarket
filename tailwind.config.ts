import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: ["class", ".theme-dark"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        soft: "var(--bg-soft)",
        card: "var(--card)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        line: "var(--line)",
        accent: "var(--accent)",
        primary: {
          DEFAULT: "var(--primary)",
          fg: "var(--primary-fg)",
          soft: "var(--primary-soft)",
        },
        ok: "var(--ok)",
        bad: "var(--bad)",
        rank: "var(--rank)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 60s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
