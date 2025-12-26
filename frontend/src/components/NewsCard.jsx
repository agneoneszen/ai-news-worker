import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Calendar, Zap, TrendingUp, ChevronRight } from 'lucide-react';

export default function NewsCard({ data }) {
  if (!data) return null;

  return (
    <article className="bg-[#1a1d23] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden mb-10 transition-all duration-300 hover:border-amber-500/30">
      
      {/* 頂部裝飾列：顯示日期與 AI 狀態 */}
      <div className="bg-gradient-to-r from-[#1e2229] to-[#1a1d23] px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
            <Calendar size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] block font-semibold">Intelligence Report</span>
            <span className="text-amber-500 font-mono font-bold text-lg tracking-wider">
              {data.date_str || data.id}
            </span>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <Zap size={14} className="text-blue-400" />
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tight">AI Processed</span>
        </div>
      </div>

      {/* 決策日報主體內容 */}
      <div className="p-6 sm:p-10">
        <div className="prose prose-invert prose-slate max-w-none 
          /* 針對 Markdown 標題的黑金風格設定 */
          prose-headings:text-amber-500 prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
          /* 針對內文與清單的設定 */
          prose-p:text-slate-300 prose-p:leading-relaxed
          prose-strong:text-amber-200 prose-strong:font-bold
          prose-li:text-slate-300 prose-li:marker:text-amber-500
          /* 針對連結的設定 */
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline">
          
          <ReactMarkdown>
            {data.content || "暫無報告內容內容"}
          </ReactMarkdown>
          
        </div>
      </div>

      {/* 底部數據與操作列 */}
      <div className="px-8 py-4 bg-[#13151a] border-t border-slate-800 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-500" />
            <span className="text-[10px] text-slate-500 uppercase font-medium">來源樣本數: {data.article_count || 0}</span>
          </div>
          <div className="flex gap-2">
            {data.tags?.map((tag, i) => (
              <span key={i} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button className="flex items-center gap-1 text-[10px] font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-widest">
          查看完整分析 <ChevronRight size={14} />
        </button>
      </div>
    </article>
  );
}