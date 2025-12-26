import React from 'react';
import { Calendar, Zap } from 'lucide-react';
import Icon from '../ui/Icon';

/**
 * 新聞卡片標題組件
 */
export default function NewsCardHeader({ dateStr, id, createdAt }) {
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

  return (
    <header className="bg-slate-800/60 px-6 py-4 border-b border-slate-700/50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-700/50 rounded-lg">
            <Calendar size={18} className="text-blue-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wide block font-medium mb-0.5">
              每日報告
            </span>
            <span className="text-slate-100 font-semibold text-xl block">
              {dateStr || id}
            </span>
            {createdAt && (
              <span className="text-xs text-slate-500 mt-0.5 block">
                {formatTimestamp(createdAt)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <Zap size={14} className="text-blue-400" />
          <span className="text-xs text-blue-400 font-medium">
            AI
          </span>
        </div>
      </div>
    </header>
  );
}

