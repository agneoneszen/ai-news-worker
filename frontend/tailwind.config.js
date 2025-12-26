/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 顏色系統 - 語義化命名
      colors: {
        // 主色調 - Amber
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // 主要使用
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // 背景色 - 語義化
        bg: {
          primary: '#0f172a',      // slate-900
          secondary: '#1e293b',    // slate-800
          tertiary: '#334155',     // slate-700
          card: 'rgba(30, 41, 59, 0.95)',
          overlay: 'rgba(15, 23, 42, 0.8)',
        },
        // 文字色 - 語義化
        text: {
          primary: '#f1f5f9',      // slate-100
          secondary: '#cbd5e1',   // slate-300
          tertiary: '#94a3b8',     // slate-400
          muted: '#64748b',        // slate-500
        },
        // 語義色
        semantic: {
          success: {
            light: '#34d399',
            main: '#10b981',
            dark: '#059669',
          },
          warning: {
            light: '#fbbf24',
            main: '#f59e0b',
            dark: '#d97706',
          },
          error: {
            light: '#f87171',
            main: '#ef4444',
            dark: '#dc2626',
          },
          info: {
            light: '#60a5fa',
            main: '#3b82f6',
            dark: '#2563eb',
          },
        },
      },
      // 間距系統
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // 字體系統
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      // 圓角系統
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // 陰影系統
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'glow-primary': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
      // 動畫
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      // 響應式斷點
      screens: {
        'xs': '475px',
        '3xl': '1680px',
      },
    },
  },
  plugins: [],
}