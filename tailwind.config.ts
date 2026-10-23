import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        paper: "#f6f7f9",
        ink: "#16202e",
        accent: {
          DEFAULT: "#2f5bea",
          soft: "#e8eeff",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
