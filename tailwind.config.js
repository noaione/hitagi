import forms from "@tailwindcss/forms";
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./assets/**/*.{js,css,scss,html}",
    "./components/**/*.{js,ts,vue}",
    "./composables/**/*.{js,ts,vue}",
    "./layouts/**/*.{js,ts,vue}",
    "./middleware/**/*.{js,ts,vue}",
    "./pages/**/*.{js,ts,vue}",
    "./utils/**/*.{js,ts,vue}",
    "./app.vue"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
        hitagi: {
          50: "#fcf7fc",
          100: "#f9eef8",
          200: "#f2dcf0",
          300: "#e7c0e3",
          400: "#d79bd0",
          500: "#c372b9",
          600: "#a6539a",
          700: "#7f3e74",
          800: "#703866",
          900: "#5d3254",
          950: "#3b1734"
        }
      }
    }
  },
  plugins: [forms({ strategy: "class" })]
};
