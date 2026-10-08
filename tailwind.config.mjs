/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#223127',
        leaf: '#3f684a',
        moss: '#78906c',
        paper: '#f6f4ed',
        clay: '#c86a47',
        sun: '#e5bd63',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        sans: ['Trebuchet MS', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 18px 48px rgba(34, 49, 39, 0.12)',
      },
    },
  },
  plugins: [],
};