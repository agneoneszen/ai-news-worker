import React from 'react';

/**
 * 圖示包裝組件
 * 提供統一的圖示樣式和容器
 */
export default function Icon({ 
  icon: IconComponent, 
  size = 20,
  color = 'primary',
  className = '',
  container = false,
  containerSize = 'md',
  ...props 
}) {
  const colorClasses = {
    primary: 'text-primary-400',
    secondary: 'text-text-secondary',
    success: 'text-semantic-success-light',
    warning: 'text-semantic-warning-light',
    error: 'text-semantic-error-light',
    info: 'text-semantic-info-light',
  };

  const containerSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3',
  };

  const iconElement = (
    <IconComponent 
      size={size} 
      className={`${colorClasses[color]} ${className}`}
      {...props}
    />
  );

  if (container) {
    return (
      <div className={`
        ${containerSizeClasses[containerSize]}
        bg-primary-500/10 rounded-lg border border-primary-500/20
        flex items-center justify-center
      `}>
        {iconElement}
      </div>
    );
  }

  return iconElement;
}

