import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      screens: {
       print: { raw: 'print' },
       screen: { raw: 'screen' },
     },
      transitionProperty: {
        'width': 'width'
      },
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('touch-only', '@media (hover:none)')
      addVariant('not-first', '&:not(:first-child)');
    })
  ]
}
