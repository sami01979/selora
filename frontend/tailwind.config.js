/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
  extend: {
    colors: {
      lavender: "#C3B7D9",
      lavenderLight: "#E4DEEF",
      plum: "#4A3B5C",
      gold: "#B98B4E",
    },
    fontFamily: {
      display: ["'Playfair Display'", "serif"],
      body: ["'Inter'", "sans-serif"],
      script: ["'Playfair Display'", "serif"],
      logo: ["'Caveat'", "cursive"],
    },
  },
},
  plugins: [],
};