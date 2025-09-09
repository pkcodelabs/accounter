/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scale: {
        200: "2",
        300: "3",
      },
      colors: {
        // Custom named colors
        myblue50: "#eff6ff", // like bg-blue-50
        myblue300: "#93c5fd", // like bg-blue-300
        mysky100: "#e0f2fe", // like bg-sky-100
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
