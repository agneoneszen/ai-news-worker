/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 顏色系統 - AI News Worker 設計系統
      colors: {
        // 主色調 - Blue（天空藍）
        'hero-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          400: '#60a5fa',
          500: '#3b82f6',  // 主要品牌色
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // 基底色 - Slate（灰藍色系）
        'hero-slate': {
          50: '#f8fafc',  // 頁面主背景
          100: '#f1f5f9', // 卡片背景、次要背景
          200: '#e2e8f0', // 邊框、分隔線
          300: '#cbd5e1', // 次要邊框
          400: '#94a3b8', // 輔助文字
          500: '#64748b', // 次要文字
          600: '#475569', // 次要標題
          700: '#334155', // 主要文字
          900: '#0f172a', // 標題文字
        },
        // 強調色 - Red（紅色）
        'hero-red': {
          50: '#fef2f2',
          200: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // 狀態色 - Green（綠色）
        'hero-green': {
          500: '#22c55e', // 連線指示、成功狀態
        },
        // 標籤色 - Yellow（黃色）
        'hero-yellow': {
          100: '#fef3c7', // 版本標籤背景
          700: '#a16207', // 版本標籤文字
        },
        // 語義色（保持向後兼容）
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
      // 動畫 - AI News Worker 設計系統
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
      // 過渡時間
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
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