/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0A2947",
          cream: "#F3E4C9",
          sage: "#D3D4C0",
          terracotta: "#8B5E3C",
          dark: "#0A2947",
          border: "#D3D4C0",
          bg: "#FAF8F5",
        },
      },
    },
  },
  plugins: [],
};
