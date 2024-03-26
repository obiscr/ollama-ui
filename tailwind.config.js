import {nextui} from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      height: {
        'nowrap-content-height': 'calc(100vh - 4rem - 2.5rem)',
        'wrap-content-height': 'calc(100vh - 4rem - 2.75rem - 6.5rem)'
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
