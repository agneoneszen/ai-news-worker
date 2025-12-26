import React from 'react';

/**
 * 標籤組件
 * 用於顯示分類、狀態等標籤
 */
export default function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) {
  const variantClasses = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/50',
    primary: 'bg-primary-500/10 text-primary-400 border-primary-500/30',
    success: 'bg-semantic-success-main/10 text-semantic-success-light border-semantic-success-main/30',
    warning: 'bg-semantic-warning-main/10 text-semantic-warning-light border-semantic-warning-main/30',
    error: 'bg-semantic-error-main/10 text-semantic-error-light border-semantic-error-main/30',
    info: 'bg-semantic-info-main/10 text-semantic-info-light border-semantic-info-main/30',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1.5',
    lg: 'text-sm px-4 py-2',
  };

  const baseClasses = `
    inline-flex items-center
    rounded-full border font-medium
    transition-colors
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={baseClasses} {...props}>
      {children}
    </span>
  );
}

