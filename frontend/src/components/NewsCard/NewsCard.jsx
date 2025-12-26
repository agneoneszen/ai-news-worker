import React, { useState } from 'react';
import NewsCardHeader from './NewsCardHeader';
import NewsCardContent from './NewsCardContent';
import NewsCardFooter from './NewsCardFooter';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * 新聞卡片主組件
 * 整合標題、內容、底部統計
 * 支持摺疊/展開功能
 */
export default function NewsCard({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!data) return null;

  // 提取摘要（用於預覽）
  const getSummary = () => {
    if (!data.content) return null;
    
    // 嘗試從 TL;DR 區塊提取
    const tldrMatch = data.content.match(/##\s+今日三句話[^\n]*\n([\s\S]*?)(?=\n##|$)/);
    if (tldrMatch) {
      const tldrContent = tldrMatch[1].trim();
      const points = tldrContent.split('\n').filter(line => line.trim().startsWith('-')).slice(0, 3);
      if (points.length > 0) {
        return points.map(p => p.replace(/^-\s*/, '').trim()).filter(Boolean);
      }
    }
    
    // 如果沒有 TL;DR，從內容開頭提取
    const firstParagraph = data.content.split('\n\n').find(p => p.trim().length > 50);
    if (firstParagraph) {
      return [firstParagraph.substring(0, 150) + (firstParagraph.length > 150 ? '...' : '')];
    }
    
    return null;
  };
  
  const summary = getSummary();

  return (
    <article className="bg-slate-800/60 rounded-xl border border-slate-700/60 overflow-hidden shadow-md hover:shadow-lg hover:border-slate-600/80 transition-all duration-200">
      {/* 預覽頭部 - 可點擊展開 */}
      <div 
        className={`p-5 cursor-pointer hover:bg-slate-800/80 transition-colors ${isExpanded ? 'border-b border-slate-700/50' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <NewsCardHeader 
              dateStr={data.date_str} 
              id={data.id}
              createdAt={data.created_at}
              compact={!isExpanded}
            />
            
            {/* 摘要預覽（未展開時顯示） */}
            {!isExpanded && summary && (
              <div className="mt-4 space-y-2">
                {summary.map((point, i) => (
                  <p key={i} className="text-slate-300 text-sm leading-6 line-clamp-2">
                    {point}
                  </p>
                ))}
              </div>
            )}
            
            {/* 統計信息（未展開時顯示） */}
            {!isExpanded && (
              <div className="mt-4">
                <NewsCardFooter
                  articleCount={data.article_count}
                  categoryCount={data.category_count}
                  categories={data.categories}
                  compact
                />
              </div>
            )}
          </div>
          
          {/* 展開/摺疊按鈕 */}
          <button
            className="flex-shrink-0 p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
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
      
      {/* 展開的詳細內容 */}
      {isExpanded && (
        <div className="border-t border-slate-700/50 bg-slate-800/40">
          <NewsCardContent 
            content={data.content}
            data={data}
          />
          
          <NewsCardFooter
            articleCount={data.article_count}
            categoryCount={data.category_count}
            categories={data.categories}
          />
        </div>
      )}
    </article>
  );
}

