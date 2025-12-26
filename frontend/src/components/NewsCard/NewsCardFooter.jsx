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
  categories = [],
  compact = false
}) {
  if (compact) {
    // 緊湊模式（列表預覽）- 參考圖片設計
    return (
      <div className="flex items-center gap-4 flex-wrap mt-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <TrendingUp size={14} className="text-blue-500" />
          <span>{articleCount || 0} 篇文章</span>
        </div>
        {categoryCount && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <FileText size={14} className="text-blue-500" />
            <span>{categoryCount} 個分類</span>
          </div>
        )}
        {categories && categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {categories.slice(0, 3).map((cat, i) => (
              <span 
                key={i}
                className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200"
              >
                {cat}
              </span>
            ))}
            {categories.length > 3 && (
              <span className="text-xs text-slate-500">
                +{categories.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // 完整模式（展開後）- 參考圖片設計
  return (
    <footer className="px-4 py-3 bg-slate-50 border-t border-slate-200">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200">
            <TrendingUp size={14} className="text-blue-500" />
            <span className="text-xs text-slate-700 font-medium">
              <span className="text-blue-600 font-semibold">{articleCount}</span> 篇文章
            </span>
          </div>
          
          {categoryCount && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200">
              <FileText size={14} className="text-blue-500" />
              <span className="text-xs text-slate-700 font-medium">
                <span className="text-blue-600 font-semibold">{categoryCount}</span> 個分類
              </span>
            </div>
          )}
        </div>

        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category, i) => (
              <span 
                key={i} 
                className="px-2.5 py-1 bg-white text-slate-700 text-xs rounded-md border border-slate-200"
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

