/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        // 'sans': ['Bebas Neue', 'sans-serif'],
        // 'bebas': ['Bebas Neue', 'sans-serif'],
        // 'mulish': ['Mulish', 'sans-serif']
      },
      colors: {
        primary: {
          50: 'rgb(var(--p-primary-50) / <alpha-value>)',
          100: 'rgb(var(--p-primary-100) / <alpha-value>)',
          200: 'rgb(var(--p-primary-200) / <alpha-value>)',
          300: 'rgb(var(--p-primary-300) / <alpha-value>)',
          400: 'rgb(var(--p-primary-400) / <alpha-value>)',
          500: 'rgb(var(--p-primary-500) / <alpha-value>)',
          600: 'rgb(var(--p-primary-600) / <alpha-value>)',
          700: 'rgb(var(--p-primary-700) / <alpha-value>)',
          800: 'rgb(var(--p-primary-800) / <alpha-value>)',
          900: 'rgb(var(--p-primary-900) / <alpha-value>)',
          950: 'rgb(var(--p-primary-950) / <alpha-value>)',
        }
      }
    }
  }
}