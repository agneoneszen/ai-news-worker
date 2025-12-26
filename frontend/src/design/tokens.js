/**
 * 設計系統 Tokens
 * 統一管理顏色、間距、字體等設計變量
 */

export const designTokens = {
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
    // 背景色 - 語義化命名
    background: {
      primary: '#0f172a',      // slate-900
      secondary: '#1e293b',     // slate-800
      tertiary: '#334155',     // slate-700
      card: 'rgba(30, 41, 59, 0.95)',  // slate-800/95
      overlay: 'rgba(15, 23, 42, 0.8)', // slate-900/80
      header: 'rgba(15, 23, 42, 0.8)',  // slate-900/80
    },
    // 文字色 - 語義化命名
    text: {
      primary: '#f1f5f9',      // slate-100
      secondary: '#cbd5e1',    // slate-300
      tertiary: '#94a3b8',     // slate-400
      muted: '#64748b',        // slate-500
      inverse: '#0f172a',      // 深色文字（用於淺色背景）
    },
    // 語義色
    semantic: {
      success: {
        light: '#34d399',      // emerald-400
        main: '#10b981',        // emerald-500
        dark: '#059669',        // emerald-600
      },
      warning: {
        light: '#fbbf24',       // amber-400
        main: '#f59e0b',        // amber-500
        dark: '#d97706',        // amber-600
      },
      error: {
        light: '#f87171',       // red-400
        main: '#ef4444',        // red-500
        dark: '#dc2626',        // red-600
      },
      info: {
        light: '#60a5fa',       // blue-400
        main: '#3b82f6',        // blue-500
        dark: '#2563eb',        // blue-600
      },
    },
  },
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: {
      primary: '0 0 20px rgba(245, 158, 11, 0.3)',
      blue: '0 0 20px rgba(59, 130, 246, 0.3)',
      emerald: '0 0 20px rgba(16, 185, 129, 0.3)',
    },
  },
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1680px',
  },
  transitions: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

// 導出常用組合
export const theme = {
  // 顏色快捷方式
  bg: {
    primary: designTokens.colors.background.primary,
    secondary: designTokens.colors.background.secondary,
    card: designTokens.colors.background.card,
  },
  text: {
    primary: designTokens.colors.text.primary,
    secondary: designTokens.colors.text.secondary,
    muted: designTokens.colors.text.muted,
  },
  // 間距快捷方式
  space: designTokens.spacing,
  // 字體快捷方式
  font: designTokens.typography,
};

