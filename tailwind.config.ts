import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bread: {
          light: "#FDF7EC",
          DEFAULT: "#FFA836",
          dark: "#D97B16",
        },
        crust: {
          light: "#8C5A35",
          DEFAULT: "#5D3A20",
        }
      },
      fontFamily: {
        sans: ['var(--font-jua)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;
