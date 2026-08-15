import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./resources/**/*.blade.php', './resources/js/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6366f1',
          fg: '#eef2ff',
        },
      },
    },
  },
  plugins: [typography],
}
