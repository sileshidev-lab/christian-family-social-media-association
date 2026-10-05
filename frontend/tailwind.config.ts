import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1200px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        earth: {
          brown: "#7A6655",
          sand: "#F5EFE6",
          olive: "#5B8C5A",
          burnt: "#C9A961",
          burgundy: "#3A6B8A",
          cream: "#FAFAF8",
          coffee: "#1E2226",
          teal: "#5A9AA8",
          cyan: "#7DBCC8",
          greenlight: "#9DC590"
        },
        "secondary-fixed": "#E8D5B0",
        "surface-container-highest": "#E2DfD5",
        "primary-fixed-dim": "#8DAAC4",
        "on-tertiary-fixed-variant": "#3A5A48",
        "surface-container-high": "#EAE5DA",
        "on-error": "#FAFAF8",
        "tertiary-fixed-dim": "#A8C9B5",
        "on-primary": "#FAFAF8",
        "on-primary-fixed-variant": "#2D4A66",
        "tertiary": "#002715",
        "inverse-primary": "#8DAAC4",
        "inverse-surface": "#2E3338",
        "on-secondary-container": "#5A4A2A",
        "surface-container-lowest": "#FAFAF8",
        "error-container": "#F0DAD5",
        "primary-container": "#2D4A66",
        "primary-fixed": "#D0DCE8",
        "outline-variant": "#D4CFC4",
        "surface-container": "#F0EBE0",
        "secondary-container": "#E8D5B0",
        "on-surface": "#1E2226",
        "surface-variant": "#E2DFD5",
        "tertiary-fixed": "#C2DCC8",
        "on-secondary-fixed-variant": "#4A3A1A",
        "on-tertiary-fixed": "#1A3A2A",
        "surface": "#FAF8F3",
        "secondary-fixed-dim": "#D4C09A",
        "on-secondary": "#FAFAF8",
        "on-surface-variant": "#4A4F55",
        "surface-dim": "#D8D3C8",
        "outline": "#9A9590",
        "on-primary-fixed": "#1A2A3A",
        "on-tertiary": "#FAFAF8",
        "surface-tint": "#5A7A95",
        "on-tertiary-container": "#7A9A85",
        "on-secondary-fixed": "#2A2010",
        "inverse-on-surface": "#E8E2D5",
        "on-background": "#1E2226",
        "surface-container-low": "#F5F1E8",
        "on-error-container": "#6A2A2A",
        "surface-bright": "#FBF9F4",
        "on-primary-container": "#A0B5C8",
        "tertiary-container": "#3A5A48"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "margin-mobile": "16px",
        "stack-gap": "1.5rem",
        "container-max": "1200px",
        "gutter": "24px",
        "unit": "8px"
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Ethiopic", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Noto Sans Ethiopic", "serif"],
        ethiopic: ["Noto Sans Ethiopic", "Inter", "system-ui", "sans-serif"],
        "headline-lg": ["Noto Sans Ethiopic"],
        "body-amharic-md": ["Noto Sans Ethiopic"],
        "body-md": ["Inter"],
        "headline-md": ["Noto Sans Ethiopic"],
        "body-lg": ["Inter"],
        "headline-lg-mobile": ["Noto Sans Ethiopic"],
        "label-sm": ["Inter"]
      },
      fontSize: {
        "headline-lg": ["32px", { lineHeight: "1.4", fontWeight: "700" }],
        "body-amharic-md": ["17px", { lineHeight: "1.8", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-lg-mobile": ["26px", { lineHeight: "1.3", fontWeight: "700" }],
        "label-sm": ["14px", { lineHeight: "1.2", fontWeight: "500" }]
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        medium: "var(--shadow-medium)",
        elevated: "var(--shadow-elevated)"
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-warm": "var(--gradient-warm)",
        "gradient-accent": "var(--gradient-accent)",
        "gradient-gold": "var(--gradient-gold)",
        "pattern-cross": "var(--pattern-cross)"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        shimmer: "shimmer 3s linear infinite"
      }
    }
  },
  plugins: [animate]
};

export default config;
