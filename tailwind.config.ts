import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#D1FAE5',
          100: '#D1FAE5',
          200: '#4A8D34',
          300: '#4A8D34',
          400: '#4A8D34',
          500: '#4A8D34',
          600: '#16A34A'
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;