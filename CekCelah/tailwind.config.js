/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
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
