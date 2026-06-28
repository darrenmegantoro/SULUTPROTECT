import type { Config } from "tailwindcss";

// Design tokens derived from the BI.go.id-inspired design system.
// Treat as design direction, not pixel-perfect values.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navyDeep: "#13294F",
        navyCore: "#1B3D6D",
        navyMid: "#2A5694",
        navyLight: "#3E6FB0",
        linkBlue: "#1565C0",
        accentRed: "#C0392B",
        offWhiteSection: "#F5F6F8",
        darkGraySurface: "#4D4D4D",
        bodyTextGray: "#5B5B5B",
        captionGray: "#8A8A8A",
        hairlineDivider: "#E0E0E0",
        headlineBlack: "#1A1A1A",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Arial",
          "Helvetica",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        container: "1280px",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(120deg, #1B3D6D 0%, #2A5694 100%)",
        "stat-gradient":
          "linear-gradient(160deg, #2A5694 0%, #1B3D6D 100%)",
        "lattice-pattern":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.06) 75%, transparent 75%, transparent)",
      },
      borderRadius: {
        subtle: "4px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(19, 41, 79, 0.08), 0 1px 2px rgba(19, 41, 79, 0.04)",
        panel: "0 12px 40px rgba(19, 41, 79, 0.18)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
