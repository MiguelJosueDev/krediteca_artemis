/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f3f9',
          100: '#dae1ef',
          200: '#b8c5df',
          300: '#8ea3ca',
          400: '#6680b2',
          500: '#4a6399',
          600: '#3a4f7d',
          700: '#2e3f63',
          800: '#1a2744',
          900: '#0B1B3F',
          950: '#060e22',
        },
        teal: {
          50: '#eefcfa',
          100: '#d5f7f2',
          200: '#afeee7',
          300: '#7ae0d6',
          400: '#46cbbf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        surface: {
          50: '#ffffff',
          100: '#f8f9fb',
          200: '#f1f3f6',
          300: '#e5e8ed',
          400: '#d1d5dc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 8px 24px 0 rgba(0, 0, 0, 0.08), 0 2px 8px -1px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}