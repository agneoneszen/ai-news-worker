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
    bg-bg-card
    ${roundedClasses[rounded]}
    ${border ? 'border border-slate-700/50' : ''}
    ${shadow ? 'shadow-2xl' : ''}
    ${hover ? 'transition-all duration-300 hover:border-primary-500/30 hover:shadow-glow-primary' : ''}
    ${paddingClasses[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}

