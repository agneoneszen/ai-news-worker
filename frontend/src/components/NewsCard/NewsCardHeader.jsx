import React from 'react';
import { Calendar, Zap } from 'lucide-react';
import Icon from '../ui/Icon';

/**
 * 新聞卡片標題組件
 */
export default function NewsCardHeader({ dateStr, id }) {
  return (
    <div className="bg-gradient-to-r from-slate-800/80 via-slate-700/60 to-slate-800/80 px-8 py-6 border-b border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <Icon 
            icon={Calendar} 
            size={24}
            color="primary"
            container
            containerSize="lg"
          />
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-[0.2em] block font-semibold mb-1.5">
              Intelligence Report
            </span>
            <span className="text-primary-400 font-mono font-bold text-2xl tracking-wider block">
              {dateStr || id}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-semantic-info-main/10 border border-semantic-info-main/30 rounded-full backdrop-blur-sm">
          <Zap size={16} className="text-semantic-info-light" />
          <span className="text-[11px] text-semantic-info-light font-bold uppercase tracking-tight">
            AI Processed
          </span>
        </div>
      </div>
    </div>
  );
}

