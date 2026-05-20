/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#3B82F6",
        softBlue: "#EFF6FF",
        darkText: "#0F172A",
      },
      boxShadow: {
        soft:
          "0px 10px 40px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
}