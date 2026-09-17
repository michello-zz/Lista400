import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#b3ccff",
          300: "#80aaff",
          400: "#4d80ff",
          500: "#1f56f0",
          600: "#1441c2",
          700: "#0f3196",
          800: "#0c2470",
          900: "#0a1c56",
        },
      },
    },
  },
  plugins: [],
};
export default config;
