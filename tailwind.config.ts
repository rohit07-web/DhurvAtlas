import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Polar Cartographic Editorial Design System tokens
        "archive-white": "#F7F9FA",
        "paper-white": "#FFFFFF",
        "expedition-ink": "#17242D",
        slate: "#53636E",
        "contour-grey": "#DCE3E7",
        "deep-teal": "#176B70",
        "glacial-ice": "#EBF2F5",
        "field-amber": "#B86B14",
        "cryo-forest": "#1F7A4C",
        "fjord-rose": "#B3392E",

        // Semantic Stitch mappings
        surface: "#F7F9FA",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F2F4F5",
        "surface-container": "#ECEEEF",
        "surface-container-high": "#E6E8E9",
        "surface-container-highest": "#E1E3E4",
        "on-surface": "#17242D",
        "on-surface-variant": "#53636E",
        primary: {
          DEFAULT: "#176B70",
          container: "#176B70",
          hover: "#12565A",
          active: "#0D4144",
        },
        secondary: {
          DEFAULT: "#53636E",
          container: "#D6E4F1",
          fixed: "#D6E4F1",
        },
        outline: {
          DEFAULT: "#DCE3E7",
          variant: "#BEC8C9",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        serif: ["var(--font-instrument-serif)", "Newsreader", "serif"],
        editorial: ["var(--font-instrument-serif)", "Newsreader", "serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
      },
      maxWidth: {
        atlas: "1280px",
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        gutter: "1.5rem",
        "gutter-mobile": "1rem",
        margin: "3rem",
        "margin-mobile": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
