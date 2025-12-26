import React, { useState } from 'react';
import Icon from './Icon';

/**
 * 區塊組件
 * 用於組織內容區塊，支持可摺疊
 */
export default function Section({ 
  icon,
  title,
  children,
  collapsible = false,
  defaultExpanded = true,
  className = '',
  ...props 
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section 
      className={`
        bg-slate-800/60 rounded-xl border border-slate-700/50 p-5 mb-6
        transition-all duration-300 hover:border-primary-500/30
        ${className}
      `}
      {...props}
    >
      <div 
        className={`
          flex items-center gap-3 mb-4
          ${collapsible ? 'cursor-pointer' : ''}
        `}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
        role={collapsible ? 'button' : undefined}
        aria-expanded={collapsible ? isExpanded : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onKeyDown={collapsible ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        } : undefined}
      >
        {icon && (
          <Icon 
            icon={icon} 
            container 
            containerSize="md"
          />
        )}
        <h2 className="text-xl font-bold text-primary-300 m-0 flex-1">
          {title}
        </h2>
        {collapsible && (
          <span className="text-slate-400 text-sm" aria-hidden="true">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
      </div>
      {isExpanded && (
        <div className="text-text-secondary leading-relaxed">
          {children}
        </div>
      )}
    </section>
  );
}

