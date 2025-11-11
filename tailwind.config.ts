import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#3A5FFF",
          violet: "#7A5AF8",
          navy: "#1A1C2E",
          lavender: "#F6F3FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],        // Inter — for body text
        display: ["var(--font-display)"],  // Plus Jakarta Sans — for headings
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
