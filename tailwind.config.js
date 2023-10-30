/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      extend: {
        padding: {
          'container-no-padding': '0',
        },
      },
    },
  },
  plugins: [],
}

