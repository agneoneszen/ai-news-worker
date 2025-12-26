import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown, ChevronUp, Zap, TrendingUp, FileText, Clock } from 'lucide-react';

/**
 * 新聞卡片預覽組件
 * 顯示報告的摘要信息，可展開查看完整內容
 */
export default function NewsCardPreview({ data, onExpand }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 提取摘要（從 TL;DR 或內容開頭）
  const summary = useMemo(() => {
    if (!data.content) return null;
    
    // 嘗試從 TL;DR 區塊提取
    const tldrMatch = data.content.match(/##\s+今日三句話[^\n]*\n([\s\S]*?)(?=\n##|$)/);
    if (tldrMatch) {
      const tldrContent = tldrMatch[1].trim();
      // 提取前 3 個要點
      const points = tldrContent.split('\n').filter(line => line.trim().startsWith('-')).slice(0, 3);
      if (points.length > 0) {
        return points.map(p => p.replace(/^-\s*/, '')).join(' • ');
      }
    }
    
    // 如果沒有 TL;DR，從內容開頭提取前 200 字
    const firstParagraph = data.content.split('\n\n')[0] || data.content.substring(0, 200);
    return firstParagraph.length > 200 ? firstParagraph.substring(0, 200) + '...' : firstParagraph;
  }, [data.content]);
  
  // 格式化日期
  const formatDate = (dateStr) => {
    if (!dateStr) return '未知日期';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // 如果不是有效日期，嘗試解析 YYYY-MM-DD 格式
        const [year, month, day] = dateStr.split('-');
        return `${year}年${month}月${day}日`;
      }
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch (e) {
      return dateStr;
    }
  };
  
  // 格式化時間戳
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    try {
      let date;
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else {
        date = new Date(timestamp);
      }
      return date.toLocaleString('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (e) {
      return null;
    }
  };
  
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && onExpand) {
      onExpand(data);
    }
  };
  
  return (
    <article className="bg-slate-800/60 rounded-xl border border-slate-700/60 overflow-hidden shadow-md hover:shadow-lg hover:border-slate-600/80 transition-all duration-200 mb-4">
      {/* 預覽頭部 */}
      <div 
        className="p-5 cursor-pointer hover:bg-slate-800/80 transition-colors"
        onClick={handleToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* 日期和標籤 */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Calendar size={14} className="text-blue-400" />
                <span className="text-sm font-semibold text-blue-300">
                  {formatDate(data.date_str || data.id)}
                </span>
              </div>
              {data.created_at && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock size={12} />
                  <span>{formatTimestamp(data.created_at)}</span>
                </div>
              )}
            </div>
            
            {/* 摘要 */}
            {summary && (
              <p className="text-slate-300 leading-6 mb-3 line-clamp-2">
                {summary}
              </p>
            )}
            
            {/* 統計信息 */}
            <div className="flex items-center gap-4 flex-wrap mt-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <TrendingUp size={14} className="text-blue-400" />
                <span>{data.article_count || 0} 篇文章</span>
              </div>
              {data.category_count && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <FileText size={14} className="text-blue-400" />
                  <span>{data.category_count} 個分類</span>
                </div>
              )}
              {data.categories && data.categories.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {data.categories.slice(0, 3).map((cat, i) => (
                    <span 
                      key={i}
                      className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded border border-slate-600/50"
                    >
                      {cat}
                    </span>
                  ))}
                  {data.categories.length > 3 && (
                    <span className="text-xs text-slate-500">
                      +{data.categories.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* 展開/摺疊按鈕 */}
          <div className="flex-shrink-0">
            <button
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
            >
              {isExpanded ? (
                <ChevronUp size={20} className="text-slate-400" />
              ) : (
                <ChevronDown size={20} className="text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* 展開的詳細內容 */}
      {isExpanded && (
        <div className="border-t border-slate-700/50 bg-slate-800/40">
          <div className="p-6">
            {/* 這裡會渲染完整內容 */}
            {onExpand && onExpand(data)}
          </div>
        </div>
      )}
    </article>
  );
}

