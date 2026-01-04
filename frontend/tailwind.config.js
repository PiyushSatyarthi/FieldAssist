/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apocalyptic Professional Palette
        'ash': {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#2d2d2d',
          800: '#1a1a1a',
          900: '#0f0f0f',
          950: '#0a0a0a',
        },
        'charcoal': {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#525252',
          700: '#434343',
          800: '#383838',
          900: '#2d2d2d',
          950: '#1a1a1a',
        },
        'amber': {
          muted: '#d97706', // Muted amber
          warning: '#f59e0b',
          dark: '#b45309',
        },
        'danger': {
          light: '#dc2626',
          DEFAULT: '#b91c1c',
          dark: '#991b1b',
        },
        'text': {
          primary: '#f5f5f5',
          secondary: '#d4d4d4',
          muted: '#a3a3a3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'danger': '0 0 0 1px rgba(185, 28, 28, 0.5)',
        'warning': '0 0 0 1px rgba(217, 119, 6, 0.5)',
      }
    },
  },
  plugins: [],
}

