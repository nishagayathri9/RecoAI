/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#050505',
          secondary: '#121212',
          tertiary: '#1A1A1A'
        },
        primary: {
          DEFAULT: '#6366F1',
          50: '#EFEEFF',
          100: '#DFE0FF',
          200: '#C2C4FE',
          300: '#A4A6FD',
          400: '#8688FC',
          500: '#6366F1',
          600: '#5052D3',
          700: '#3E40B5',
          800: '#2C2E97',
          900: '#1A1C79'
        },
        secondary: {
          DEFAULT: '#F472B6',
          50: '#FEF2F9',
          100: '#FDE6F3',
          200: '#FBCCE7',
          300: '#F9B2DB',
          400: '#F699CF',
          500: '#F472B6',
          600: '#D15D9A',
          700: '#AF497F',
          800: '#8C3564',
          900: '#6A2148'
        },
        accent: {
          DEFAULT: '#F59E0B',
          50: '#FEF5E7',
          100: '#FDECCE',
          200: '#FBD89D',
          300: '#F9C56D',
          400: '#F7B13C',
          500: '#F59E0B',
          600: '#D28209',
          700: '#AF6707',
          800: '#8C4D05',
          900: '#693303'
        },
        success: {
          DEFAULT: '#10B981',
          lighter: '#D1FAE5',
        },
        warning: {
          DEFAULT: '#F97316',
          lighter: '#FFEDD5',
        },
        error: {
          DEFAULT: '#EF4444',
          lighter: '#FEE2E2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};