/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#057455',
        secondary: '#059C73',
        borderStock: '#059C73',
        greenStock: '#059C73',
        redStock: '#D20F0F'
      }
    },
  },
  plugins: [],
}
