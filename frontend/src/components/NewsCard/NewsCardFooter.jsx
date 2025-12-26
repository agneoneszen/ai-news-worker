import React from 'react';
import { TrendingUp, FileText } from 'lucide-react';
import Badge from '../ui/Badge';
import Icon from '../ui/Icon';

/**
 * 新聞卡片底部統計組件
 */
export default function NewsCardFooter({ 
  articleCount = 0, 
  categoryCount,
  categories = [] 
}) {
  return (
    <footer className="px-6 py-4 bg-slate-800/40 border-t border-slate-700/50">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg">
            <TrendingUp size={14} className="text-blue-400" />
            <span className="text-xs text-slate-300 font-medium">
              <span className="text-blue-400 font-semibold">{articleCount}</span> 篇文章
            </span>
          </div>
          
          {categoryCount && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg">
              <FileText size={14} className="text-blue-400" />
              <span className="text-xs text-slate-300 font-medium">
                <span className="text-blue-400 font-semibold">{categoryCount}</span> 個分類
              </span>
            </div>
          )}
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category, i) => (
              <span 
                key={i} 
                className="px-2.5 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md border border-slate-600/50"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}

