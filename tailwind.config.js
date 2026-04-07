/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'angola-red': '#CE1126',
        'angola-black': '#000000',
        'angola-yellow': '#FFCD00',
        'pna-blue': '#1B365C',
        'pna-light-blue': '#3B82F6'
      },
    },
  },
  plugins: [],
}
