import React from 'react';

/**
 * 基礎卡片組件
 * 提供統一的卡片樣式和行為
 */
export default function Card({ 
  children, 
  className = '',
  hover = false,
  padding = 'lg',
  rounded = '2xl',
  border = true,
  shadow = true,
  ...props 
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  };

  const baseClasses = `
    bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90
    ${roundedClasses[rounded]}
    ${border ? 'border-2 border-slate-600/60' : ''}
    ${shadow ? 'shadow-2xl shadow-black/20' : ''}
    ${hover ? 'transition-all duration-300 hover:border-primary-500/50 hover:shadow-glow-primary' : ''}
    ${paddingClasses[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}

