import React from 'react';
import { FileText, Map, Settings, BarChart3 } from 'lucide-react';

/**
 * 底部導航欄組件
 */
export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'reports', label: '報告', icon: FileText },
    { id: 'analytics', label: '分析', icon: BarChart3 },
    { id: 'map', label: '地圖', icon: Map },
    { id: 'settings', label: '設定', icon: Settings },
  ];

  return (
    <nav 
      className="
        fixed bottom-0 left-0 right-0 
        bg-white 
        border-t border-slate-200 
        z-50
        safe-area-inset-bottom
      "
      role="navigation"
      aria-label="底部導航"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative 
                  flex flex-col items-center 
                  gap-1 
                  px-4 py-2 
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg
                  ${isActive ? 'text-blue-500' : 'text-slate-500'}
                `}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon 
                  size={20} 
                  className={isActive ? 'text-blue-500' : 'text-slate-500'} 
                />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <div className="
                    absolute 
                    bottom-0 
                    left-1/2 
                    transform -translate-x-1/2 
                    w-8 h-0.5 
                    bg-blue-500 
                    rounded-full
                  " />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

