import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        'width': 'width'
      },
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('touch-only', '@media (hover:none)')
    })
  ]}
