import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Calendar, Zap, TrendingUp, ChevronRight, ExternalLink, FileText } from 'lucide-react';

export default function NewsCard({ data }) {
  if (!data) return null;

  return (
    <article className="bg-gradient-to-br from-[#1a1d23] via-[#1e2229] to-[#1a1d23] rounded-3xl border border-slate-800/50 shadow-2xl overflow-hidden mb-12 transition-all duration-300 hover:border-amber-500/40 hover:shadow-amber-500/10">
      
      {/* 頂部標題區塊 */}
      <div className="bg-gradient-to-r from-[#1e2229] via-[#252932] to-[#1e2229] px-8 py-6 border-b border-slate-800/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl border border-amber-500/20">
              <Calendar size={24} className="text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-[0.15em] block font-semibold mb-1">Intelligence Report</span>
              <span className="text-amber-400 font-mono font-bold text-2xl tracking-wider">
                {data.date_str || data.id}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm">
            <Zap size={16} className="text-blue-400" />
            <span className="text-[11px] text-blue-300 font-bold uppercase tracking-tight">AI Processed</span>
          </div>
        </div>
      </div>

      {/* 主內容區塊 */}
      <div className="p-8 sm:p-12">
        <div className="prose prose-invert prose-slate max-w-none
          prose-headings:text-amber-400 prose-headings:font-bold prose-headings:tracking-tight prose-headings:mb-4 prose-headings:mt-8
          prose-h1:text-3xl prose-h1:border-b prose-h1:border-amber-500/30 prose-h1:pb-3 prose-h1:mb-6
          prose-h2:text-2xl prose-h2:text-amber-300 prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-xl prose-h3:text-amber-200 prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base
          prose-strong:text-amber-200 prose-strong:font-bold
          prose-ul:text-slate-300 prose-ul:my-4
          prose-li:text-slate-300 prose-li:my-2 prose-li:marker:text-amber-500
          prose-ol:text-slate-300 prose-ol:my-4
          prose-blockquote:border-l-amber-500/50 prose-blockquote:text-slate-400 prose-blockquote:pl-4 prose-blockquote:italic
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline prose-a:font-medium
          prose-code:text-amber-300 prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700">
          
          <ReactMarkdown
            components={{
              // 自訂連結樣式
              a: ({node, ...props}) => (
                <a {...props} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
                  {props.children}
                  <ExternalLink size={14} className="inline" />
                </a>
              ),
              // 自訂標題樣式
              h1: ({node, ...props}) => (
                <h1 {...props} className="text-3xl font-bold text-amber-400 border-b border-amber-500/30 pb-3 mb-6 mt-0" />
              ),
              h2: ({node, ...props}) => (
                <h2 {...props} className="text-2xl font-bold text-amber-300 mt-8 mb-4 flex items-center gap-2" />
              ),
              h3: ({node, ...props}) => (
                <h3 {...props} className="text-xl font-semibold text-amber-200 mt-6 mb-3" />
              ),
            }}
          >
            {data.content || "暫無報告內容"}
          </ReactMarkdown>
          
        </div>
      </div>

      {/* 底部統計與標籤區塊 */}
      <div className="px-8 py-6 bg-[#13151a] border-t border-slate-800/50">
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-xs text-slate-300 font-medium">
                來源樣本數: <span className="text-emerald-400 font-bold">{data.article_count || 0}</span>
              </span>
            </div>
            
            {data.category_count && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <FileText size={16} className="text-purple-400" />
                <span className="text-xs text-slate-300 font-medium">
                  分類數: <span className="text-purple-400 font-bold">{data.category_count}</span>
                </span>
              </div>
            )}
          </div>

          {data.categories && data.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.categories.map((category, i) => (
                <span key={i} className="text-xs bg-slate-800/80 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700/50 font-medium">
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
