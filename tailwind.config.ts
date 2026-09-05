import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
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
    },
  },
  plugins: [],
};

export default config;
