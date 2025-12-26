import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Calendar, 
  Zap, 
  TrendingUp, 
  FileText, 
  BarChart3,
  Waves,
  Compass,
  Telescope,
  TrendingDown,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import ReportSection from './ReportSection';

export default function NewsCard({ data }) {
  if (!data) return null;
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <article className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden mb-12 transition-all duration-300 hover:border-amber-500/30 hover:shadow-amber-500/10">
      
      {/* 頂部標題區塊 - 改進設計 */}
      <div className="bg-gradient-to-r from-slate-800/80 via-slate-700/60 to-slate-800/80 px-8 py-6 border-b border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl border border-amber-500/30 shadow-lg shadow-amber-500/10">
              <Calendar size={24} className="text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-[0.2em] block font-semibold mb-1.5">
                Intelligence Report
              </span>
              <span className="text-amber-400 font-mono font-bold text-2xl tracking-wider block">
                {data.date_str || data.id}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full backdrop-blur-sm">
              <Zap size={16} className="text-blue-400" />
              <span className="text-[11px] text-blue-300 font-bold uppercase tracking-tight">
                AI Processed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 主內容區塊 - 區塊化設計 */}
      <div className="p-8 sm:p-10">
        <div className="prose prose-invert prose-slate max-w-none
          prose-headings:text-amber-400 prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-3xl prose-h1:mb-6 prose-h1:pb-4 prose-h1:border-b prose-h1:border-amber-500/30
          prose-h2:text-2xl prose-h2:text-amber-300 prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-xl prose-h3:text-amber-200 prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base
          prose-strong:text-amber-200 prose-strong:font-bold
          prose-ul:text-slate-300 prose-ul:my-4 prose-ul:space-y-2
          prose-li:text-slate-300 prose-li:my-2 prose-li:marker:text-amber-500
          prose-ol:text-slate-300 prose-ol:my-4
          prose-blockquote:border-l-amber-500/50 prose-blockquote:text-slate-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline prose-a:font-medium prose-a:inline-flex prose-a:items-center prose-a:gap-1
          prose-code:text-amber-300 prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-lg prose-pre:p-4">
          
          <ReactMarkdown
            components={{
              // 自訂 H1 樣式（TL;DR 區塊）
              h1: ({node, children, ...props}) => {
                const content = String(children);
                if (content.includes('TL;DR') || content.includes('三句話')) {
                  return (
                    <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-amber-500/10 rounded-2xl border border-amber-500/30 p-6 mb-8">
                      <h1 {...props} className="text-2xl font-bold text-amber-300 mb-4 border-none pb-0">
                        {children}
                      </h1>
                    </div>
                  );
                }
                return <h1 {...props} className="text-3xl font-bold text-amber-400 border-b border-amber-500/30 pb-3 mb-6 mt-0">{children}</h1>;
              },
              // 自訂 H2 樣式（帶圖示的區塊標題）
              h2: ({node, children, ...props}) => {
                const content = String(children);
                let Icon = BarChart3;
                if (content.includes('市場情緒') || content.includes('儀表板')) Icon = BarChart3;
                else if (content.includes('趨勢') || content.includes('核心')) Icon = Waves;
                else if (content.includes('決策') || content.includes('指引')) Icon = Compass;
                else if (content.includes('監測') || content.includes('清單')) Icon = Telescope;
                else if (content.includes('分類') || content.includes('摘要')) Icon = FileText;
                else if (content.includes('不確定') || content.includes('反方')) Icon = AlertTriangle;
                else if (content.includes('來源') || content.includes('資訊')) Icon = ExternalLink;
                
                return (
                  <div className="flex items-center gap-3 mb-4 mt-8 pt-4 border-t border-slate-700/50">
                    <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <Icon size={18} className="text-amber-400" />
                    </div>
                    <h2 {...props} className="text-xl font-bold text-amber-300 m-0">
                      {children}
                    </h2>
                  </div>
                );
              },
              // 自訂 H3 樣式
              h3: ({node, children, ...props}) => (
                <h3 {...props} className="text-lg font-semibold text-amber-200 mt-6 mb-3 flex items-center gap-2">
                  {children}
                </h3>
              ),
              // 自訂連結樣式
              a: ({node, href, children, ...props}) => (
                <a 
                  {...props} 
                  href={href}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-medium underline decoration-blue-500/50 underline-offset-2"
                >
                  {children}
                  <ExternalLink size={14} className="inline" />
                </a>
              ),
              // 自訂列表樣式
              ul: ({node, children, ...props}) => (
                <ul {...props} className="space-y-2 my-4 list-disc list-inside marker:text-amber-500">
                  {children}
                </ul>
              ),
              // 自訂列表項樣式
              li: ({node, children, ...props}) => (
                <li {...props} className="text-slate-300 my-2 pl-2">
                  {children}
                </li>
              ),
              // 自訂段落樣式
              p: ({node, children, ...props}) => (
                <p {...props} className="text-slate-300 leading-relaxed mb-4 text-base">
                  {children}
                </p>
              ),
            }}
          >
            {data.content || "暫無報告內容"}
          </ReactMarkdown>
          
        </div>
      </div>

      {/* 底部統計與標籤區塊 - 改進設計 */}
      <div className="px-8 py-6 bg-slate-900/60 border-t border-slate-700/50 backdrop-blur-sm">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-xs text-slate-300 font-medium">
                來源: <span className="text-emerald-400 font-bold">{data.article_count || 0}</span> 篇
              </span>
            </div>
            
            {data.category_count && (
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <FileText size={16} className="text-purple-400" />
                <span className="text-xs text-slate-300 font-medium">
                  分類: <span className="text-purple-400 font-bold">{data.category_count}</span>
                </span>
              </div>
            )}
          </div>

          {data.categories && data.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.categories.map((category, i) => (
                <span 
                  key={i} 
                  className="text-xs bg-slate-800/80 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700/50 font-medium hover:border-amber-500/50 transition-colors"
                >
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
