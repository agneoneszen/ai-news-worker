import React from 'react';

/**
 * 版本信息組件
 * 顯示構建時間和版本號
 */
export default function VersionInfo() {
  // 構建時間（在構建時注入）
  const buildTime = import.meta.env.VITE_BUILD_TIME || new Date().toISOString();
  const version = import.meta.env.VITE_APP_VERSION || '1.0.0';
  
  return (
    <div className="fixed bottom-4 right-4 bg-slate-800/90 border border-slate-700/50 rounded-lg px-3 py-2 text-xs font-mono backdrop-blur-sm z-50">
      <div className="text-slate-400">
        <div>UI v{version}</div>
        <div className="text-slate-500 mt-1">
          {new Date(buildTime).toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}
        </div>
      </div>
    </div>
  );
}

