import React from 'react';

/**
 * 調試信息組件
 * 顯示當前 UI 版本和內容格式信息
 */
export default function DebugInfo({ data }) {
  const [showDebug, setShowDebug] = React.useState(false);
  
  if (!data) return null;
  
  return (
    <div className="mb-4">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
      >
        {showDebug ? '隱藏' : '顯示'} 調試信息
      </button>
      
      {showDebug && (
        <div className="mt-2 bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-xs font-mono">
          <div className="space-y-2 text-slate-400">
            <div>
              <span className="text-slate-500">UI 版本:</span>{' '}
              <span className="text-primary-400">{new Date().toISOString()}</span>
            </div>
            <div>
              <span className="text-slate-500">文章 ID:</span>{' '}
              <span className="text-slate-300">{data.id}</span>
            </div>
            <div>
              <span className="text-slate-500">日期:</span>{' '}
              <span className="text-slate-300">{data.date_str || data.id}</span>
            </div>
            <div>
              <span className="text-slate-500">內容長度:</span>{' '}
              <span className="text-slate-300">{data.content?.length || 0} 字元</span>
            </div>
            <div>
              <span className="text-slate-500">是否包含 ## :</span>{' '}
              <span className={data.content?.includes('## ') ? 'text-green-400' : 'text-red-400'}>
                {data.content?.includes('## ') ? '是' : '否'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">H2 標題數量:</span>{' '}
              <span className="text-slate-300">
                {(data.content?.match(/^##\s+.+$/gm) || []).length}
              </span>
            </div>
            <div>
              <span className="text-slate-500">內容前 300 字:</span>
              <pre className="mt-1 text-slate-300 whitespace-pre-wrap break-words">
                {data.content?.substring(0, 300)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

