/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F5",
        plum: "#3D1E2F",
        "plum-light": "#5A3145",
        berry: "#C2185B",
        gold: "#D4A373",
        sage: "#7C9885",
        ink: "#2B1B22",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};