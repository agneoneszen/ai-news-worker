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
      <div className="p-8 sm:p-10 space-y-6">
        <ReactMarkdown
          components={{
            // 自訂 H1 樣式（TL;DR 區塊）- 特殊突出顯示
            h1: ({node, children, ...props}) => {
              const content = String(children);
              if (content.includes('TL;DR') || content.includes('三句話') || content.includes('今日三句話')) {
                return (
                  <div className="bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-amber-500/15 rounded-2xl border-2 border-amber-500/40 p-6 mb-8 shadow-lg shadow-amber-500/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Zap size={20} className="text-amber-300" />
                      </div>
                      <h1 className="text-2xl font-bold text-amber-300 m-0">
                        {children}
                      </h1>
                    </div>
                  </div>
                );
              }
              return (
                <h1 className="text-3xl font-bold text-amber-400 border-b-2 border-amber-500/40 pb-4 mb-8 mt-0">
                  {children}
                </h1>
              );
            },
            // 自訂 H2 樣式（帶圖示的區塊標題）- 卡片式設計
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
                <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-5 mb-6 mt-8 hover:border-amber-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/15 rounded-lg border border-amber-500/30 flex-shrink-0">
                      <Icon size={20} className="text-amber-400" />
                    </div>
                    <h2 className="text-xl font-bold text-amber-300 m-0 flex-1">
                      {children}
                    </h2>
                  </div>
                </div>
              );
            },
            // 自訂 H3 樣式 - 子標題
            h3: ({node, children, ...props}) => (
              <h3 className="text-lg font-semibold text-amber-200 mt-6 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                {children}
              </h3>
            ),
            // 自訂段落樣式
            p: ({node, children, ...props}) => (
              <p className="text-slate-300 leading-relaxed mb-5 text-base">
                {children}
              </p>
            ),
            // 自訂連結樣式
            a: ({node, href, children, ...props}) => (
              <a 
                {...props} 
                href={href}
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-medium underline decoration-blue-500/50 underline-offset-2 hover:decoration-blue-400"
              >
                {children}
                <ExternalLink size={14} className="inline" />
              </a>
            ),
            // 自訂列表樣式
            ul: ({node, children, ...props}) => (
              <ul className="space-y-3 my-5 ml-4 list-disc marker:text-amber-500">
                {children}
              </ul>
            ),
            // 自訂列表項樣式
            li: ({node, children, ...props}) => (
              <li className="text-slate-300 my-2 pl-2 leading-relaxed">
                {children}
              </li>
            ),
            // 自訂有序列表
            ol: ({node, children, ...props}) => (
              <ol className="space-y-3 my-5 ml-4 list-decimal marker:text-amber-500">
                {children}
              </ol>
            ),
            // 自訂強調樣式
            strong: ({node, children, ...props}) => (
              <strong className="text-amber-200 font-bold">
                {children}
              </strong>
            ),
            // 自訂引用樣式
            blockquote: ({node, children, ...props}) => (
              <blockquote className="border-l-4 border-amber-500/50 pl-4 italic text-slate-400 my-5 bg-slate-800/30 py-3 rounded-r-lg">
                {children}
              </blockquote>
            ),
            // 自訂代碼樣式
            code: ({node, inline, children, ...props}) => {
              if (inline) {
                return (
                  <code className="text-amber-300 bg-slate-800/70 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-700/50">
                    {children}
                  </code>
                );
              }
              return (
                <code className="block text-amber-300 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono overflow-x-auto my-4">
                  {children}
                </code>
              );
            },
          }}
          className="markdown-content"
        >
          {data.content || "暫無報告內容"}
        </ReactMarkdown>
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
