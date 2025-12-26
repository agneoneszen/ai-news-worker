import React from 'react';
import { Calendar, Zap } from 'lucide-react';
import Icon from '../ui/Icon';

/**
 * 新聞卡片標題組件
 */
export default function NewsCardHeader({ dateStr, id, createdAt, compact = false }) {
  // 格式化時間戳
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '未知時間';
    
    try {
      // Firestore Timestamp 轉換
      let date;
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else {
        date = new Date(timestamp);
      }
      
      return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (e) {
      return '時間格式錯誤';
    }
  };

  // 格式化日期（更友好的格式）
  const formatDate = (dateStr) => {
    if (!dateStr) return '未知日期';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // 如果不是有效日期，嘗試解析 YYYY-MM-DD 格式
        const [year, month, day] = dateStr.split('-');
        if (year && month && day) {
          return `${year}年${month}月${day}日`;
        }
        return dateStr;
      }
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: compact ? undefined : 'long'
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (compact) {
    // 緊湊模式（列表預覽）- 參考圖片設計
    return (
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
          <Calendar size={14} className="text-blue-500" />
          <span className="text-sm font-semibold text-blue-700">
            {formatDate(dateStr || id)}
          </span>
        </div>
        {createdAt && (
          <span className="text-xs text-slate-500">
            {formatTimestamp(createdAt)}
          </span>
        )}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-200 rounded">
          <Zap size={12} className="text-blue-500" />
          <span className="text-xs text-blue-600 font-medium">AI</span>
        </div>
      </div>
    );
  }

  // 完整模式（展開後）- 參考圖片設計
  return (
    <header className="px-4 py-3 border-b border-slate-200 bg-slate-50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
            <Calendar size={18} className="text-blue-500" />
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide block font-medium mb-0.5">
              每日報告
            </span>
            <span className="text-slate-900 font-semibold text-lg block">
              {formatDate(dateStr || id)}
            </span>
            {createdAt && (
              <span className="text-xs text-slate-500 mt-0.5 block">
                {formatTimestamp(createdAt)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
          <Zap size={14} className="text-blue-500" />
          <span className="text-xs text-blue-600 font-medium">
            AI
          </span>
        </div>
      </div>
    </header>
  );
}

