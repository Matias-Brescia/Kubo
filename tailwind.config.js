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
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
        category: {
          food: "hsl(var(--category-food))",
          transport: "hsl(var(--category-transport))",
          home: "hsl(var(--category-home))",
          health: "hsl(var(--category-health))",
          entertainment: "hsl(var(--category-entertainment))",
          education: "hsl(var(--category-education))",
          shopping: "hsl(var(--category-shopping))",
          work: "hsl(var(--category-work))",
          travel: "hsl(var(--category-travel))",
          pets: "hsl(var(--category-pets))",
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
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
        "4xl": ["36px", { lineHeight: "40px" }],
        "5xl": ["48px", { lineHeight: "48px" }],
      },
      transitionDuration: {
        150: "150ms",
        200: "200ms",
        300: "300ms",
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
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
