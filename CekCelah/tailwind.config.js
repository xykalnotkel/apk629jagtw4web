/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "metal-panel", "metal-btn", "metal-input", "brushed", "rivet",
    "grid-bg", "scan-beam", "chip", "chip-pass", "chip-warn", "chip-fail",
    "status-dot", "status-pass", "status-warn", "status-fail",
    "graffiti-text", "shimmer-bar", "ring-glow",
    "bg-deep", "bg-ice-200", "text-deep", "text-ice-50", "text-ice-100", "text-ice-200", "text-ice-300",
    "border-ice-300/10", "border-ice-300/15", "border-ice-300/20", "border-ice-300/25", "border-ice-300/30",
    "border-ice-300/40", "border-ice-300/60",
  ],
  theme: {
    extend: {
      colors: {
        deep: {
          DEFAULT: "#1e3a8a",
          950: "#0b1a3f",
          900: "#0f2557",
          800: "#12306b",
          700: "#1e3a8a",
          600: "#2548a8",
        },
        ice: {
          DEFAULT: "#e0f0ff",
          50: "#f7fbff",
          100: "#eaf4ff",
          200: "#dbeafe",
          300: "#bfdbfe",
          400: "#93c5fd",
        },
        metal: {
          900: "#0a0f1f",
          800: "#0f1629",
          700: "#151d35",
          600: "#1b2545",
        },
      },
      boxShadow: {
        metal:
          "inset 0 1px 0 rgba(224,240,255,0.08), 0 10px 30px rgba(0,0,0,0.4)",
        "metal-sm":
          "inset 0 1px 0 rgba(224,240,255,0.06), 0 2px 8px rgba(0,0,0,0.3)",
        "glow-blue":
          "0 0 0 1px rgba(191,219,254,0.15), 0 0 24px rgba(30,58,138,0.4)",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        scan: "scan 2.5s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        pulseSoft: "pulseSoft 2.5s ease-in-out infinite",
        rise: "rise 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

module.exports = config;
