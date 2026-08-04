/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        surface: "hsl(var(--surface))",
        "surface-hover": "hsl(var(--surface-hover))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          soft: "hsl(var(--accent-soft))",
        },
        negative: {
          DEFAULT: "hsl(var(--negative))",
          soft: "hsl(var(--negative-soft))",
        },
      },
      borderRadius: {
        kubo: "18px",
        "kubo-sm": "12px",
      },
      fontFamily: {
        sans: ["Geist Sans", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        kubo: "0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 1px 0 rgba(0,0,0,0.03)",
        "kubo-lg": "0 8px 30px -8px rgba(0,0,0,0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
