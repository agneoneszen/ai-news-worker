import React from 'react';

export default function ReportSection({ 
  icon: Icon, 
  title, 
  children, 
  className = "",
  collapsible = false,
  defaultExpanded = true 
}) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <section className={`bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-6 transition-all duration-300 hover:border-slate-600/50 ${className}`}>
      <div 
        className={`flex items-center gap-3 mb-4 ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        {Icon && (
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <Icon size={20} className="text-amber-400" />
          </div>
        )}
        <h2 className="text-xl font-bold text-amber-300 flex-1">{title}</h2>
        {collapsible && (
          <span className="text-slate-400 text-sm">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
      </div>
      {isExpanded && (
        <div className="text-slate-300 leading-relaxed">
          {children}
        </div>
      )}
    </section>
  );
}

