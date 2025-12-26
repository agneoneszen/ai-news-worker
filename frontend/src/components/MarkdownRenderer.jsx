import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Zap, 
  BarChart3,
  Waves,
  Compass,
  Search,
  FileText,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import Icon from './ui/Icon';

/**
 * Markdown 渲染器組件
 * 將 Markdown 內容渲染為美觀的 UI
 */
export default function MarkdownRenderer({ content }) {
  // 圖示映射 - 擴展匹配邏輯
  const iconMapping = {
    '市場情緒': BarChart3,
    '儀表板': BarChart3,
    '情緒': BarChart3,
    '趨勢': Waves,
    '核心': Waves,
    '核心趨勢': Waves,
    '決策': Compass,
    '指引': Compass,
    '決策指引': Compass,
    '監測': Search,
    '清單': Search,
    '監測清單': Search,
    '今日監測': Search,
    '分類': FileText,
    '摘要': FileText,
    '分類摘要': FileText,
    '不確定': AlertTriangle,
    '反方': AlertTriangle,
    '不確定性': AlertTriangle,
    '來源': ExternalLink,
    '資訊': ExternalLink,
    '資訊來源': ExternalLink,
  };

  // 獲取對應的圖示
  const getIcon = (content) => {
    for (const [key, Icon] of Object.entries(iconMapping)) {
      if (content.includes(key)) {
        return Icon;
      }
    }
    return BarChart3; // 默認圖示
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // H1 樣式 - TL;DR 特殊處理
          h1: ({node, children, ...props}) => {
            const content = String(children);
            const isTLDR = content.includes('TL;DR') || 
                          content.includes('三句話') || 
                          content.includes('今日三句話');
            
            if (isTLDR) {
              return (
                <div className="bg-gradient-to-r from-primary-500/15 via-primary-600/10 to-primary-500/15 rounded-2xl border-2 border-primary-500/40 p-8 mb-10 shadow-lg shadow-glow-primary text-center">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Icon 
                      icon={Zap} 
                      container 
                      containerSize="md"
                      color="primary"
                    />
                    <h1 className="text-2xl font-bold text-primary-300 m-0">
                      {children}
                    </h1>
                  </div>
                </div>
              );
            }
            
            return (
              <h1 className="text-3xl font-bold text-primary-400 border-b-2 border-primary-500/40 pb-4 mb-8 mt-0">
                {children}
              </h1>
            );
          },
          
          // H2 樣式 - 卡片式區塊標題（處理可能是 H2 的 TL;DR）
          h2: ({node, children, ...props}) => {
            const content = String(children);
            
            // 檢查是否為 TL;DR（可能是 H2 格式）
            const isTLDR = content.includes('TL;DR') || 
                          content.includes('三句話') || 
                          content.includes('今日三句話');
            
            if (isTLDR) {
              return (
                <div className="bg-gradient-to-r from-primary-500/15 via-primary-600/10 to-primary-500/15 rounded-2xl border-2 border-primary-500/40 p-8 mb-10 shadow-lg shadow-glow-primary text-center">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Icon 
                      icon={Zap} 
                      container 
                      containerSize="md"
                      color="primary"
                    />
                    <h2 className="text-2xl font-bold text-primary-300 m-0">
                      {children}
                    </h2>
                  </div>
                </div>
              );
            }
            
            // 處理可能包含 emoji 的標題
            const cleanContent = content.replace(/[📊🌊🧭🔭📈🧱🔗]/g, '').trim();
            const icon = getIcon(cleanContent);
            const IconComponent = icon;
            
            return (
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 rounded-xl border-2 border-slate-700/50 p-6 mb-8 mt-8 hover:border-primary-500/40 transition-all duration-300 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary-500/20 rounded-lg border-2 border-primary-500/40 flex-shrink-0 shadow-md">
                    <IconComponent size={20} className="text-primary-300" />
                  </div>
                  <h2 className="text-xl font-bold text-primary-300 m-0 text-center">
                    {children}
                  </h2>
                </div>
              </div>
            );
          },
          
          
          // H3 樣式 - 子標題（置中）
          h3: ({node, children, ...props}) => (
            <h3 className="text-lg font-semibold text-primary-200 mt-6 mb-4 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
              {children}
            </h3>
          ),
          
          // 段落樣式 - 置中排版
          p: ({node, children, ...props}) => {
            const content = String(children);
            // TL;DR 區塊後的段落也置中
            const isInTLDR = node.parent?.children?.some(
              (sibling) => sibling.type === 'heading' && 
              (String(sibling.children?.[0]?.value || '').includes('TL;DR') || 
               String(sibling.children?.[0]?.value || '').includes('三句話'))
            );
            
            return (
              <p className={`text-text-secondary leading-relaxed mb-5 text-base ${isInTLDR ? 'text-center max-w-3xl mx-auto' : ''}`}>
                {children}
              </p>
            );
          },
          
          // 連結樣式
          a: ({node, href, children, ...props}) => (
            <a 
              {...props} 
              href={href}
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 text-semantic-info-light hover:text-semantic-info-main transition-colors font-medium underline decoration-semantic-info-main/50 underline-offset-2 hover:decoration-semantic-info-main focus:outline-none focus:ring-2 focus:ring-semantic-info-main focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
            >
              {children}
              <ExternalLink size={14} className="inline" />
            </a>
          ),
          
          // 無序列表 - 檢查是否為監測清單，並置中排版
          ul: ({node, children, ...props}) => {
            // 檢查父節點是否是監測清單（通過檢查前一個兄弟節點）
            const parent = node.parent;
            let isChecklist = false;
            
            if (parent && parent.children) {
              const index = parent.children.indexOf(node);
              if (index > 0) {
                const prevSibling = parent.children[index - 1];
                if (prevSibling && prevSibling.type === 'heading') {
                  const headingText = String(prevSibling.children?.[0]?.value || '');
                  if (headingText.includes('監測') || headingText.includes('清單')) {
                    isChecklist = true;
                  }
                }
              }
            }
            
            if (isChecklist) {
              return (
                <ul className="space-y-3 my-5 mx-auto max-w-2xl list-none">
                  {children}
                </ul>
              );
            }
            
            return (
              <ul className="space-y-3 my-5 mx-auto max-w-3xl list-disc marker:text-primary-500">
                {children}
              </ul>
            );
          },
          
          // 列表項 - 支持 checkbox 和普通列表
          li: ({node, children, ...props}) => {
            // ReactMarkdown + remark-gfm 會將 checkbox 轉換為特殊的結構
            const childrenArray = React.Children.toArray(children);
            
            // 檢查第一個子元素是否為 checkbox input（remark-gfm 的格式）
            if (childrenArray.length > 0) {
              const firstChild = childrenArray[0];
              if (React.isValidElement(firstChild) && firstChild.type === 'input' && firstChild.props.type === 'checkbox') {
                return (
                  <li className="text-text-secondary my-2 pl-2 leading-relaxed flex items-start gap-2 list-none">
                    <input 
                      type="checkbox" 
                      checked={firstChild.props.checked || false}
                      readOnly
                      className="mt-1.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-primary-500 focus:ring-primary-500 cursor-default"
                    />
                    <span>{childrenArray.slice(1)}</span>
                  </li>
                );
              }
            }
            
            // 檢查父節點是否是監測清單
            const parent = node.parent;
            let isChecklist = false;
            if (parent && parent.children) {
              const index = parent.children.indexOf(node);
              if (index > 0) {
                // 向上查找標題
                for (let i = index - 1; i >= 0; i--) {
                  const sibling = parent.children[i];
                  if (sibling && sibling.type === 'heading') {
                    const headingText = String(sibling.children?.[0]?.value || '');
                    if (headingText.includes('監測') || headingText.includes('清單') || headingText.includes('🔭')) {
                      isChecklist = true;
                      break;
                    }
                  }
                  if (sibling && sibling.type !== 'paragraph' && sibling.type !== 'list') {
                    break;
                  }
                }
              }
            }
            
            // 如果是監測清單，即使沒有 checkbox 格式也顯示為 checkbox
            if (isChecklist) {
              const content = String(children).trim();
              return (
                <li className="text-text-secondary my-2 pl-2 leading-relaxed flex items-start gap-2 list-none">
                  <input 
                    type="checkbox" 
                    checked={false}
                    readOnly
                    className="mt-1.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-primary-500 focus:ring-primary-500 cursor-default"
                  />
                  <span>{content}</span>
                </li>
              );
            }
            
            return (
              <li className="text-text-secondary my-2 pl-2 leading-relaxed">
                {children}
              </li>
            );
          },
          
          // 有序列表
          ol: ({node, children, ...props}) => (
            <ol className="space-y-3 my-5 ml-4 list-decimal marker:text-primary-500">
              {children}
            </ol>
          ),
          
          // 強調
          strong: ({node, children, ...props}) => (
            <strong className="text-primary-200 font-bold">
              {children}
            </strong>
          ),
          
          // 引用
          blockquote: ({node, children, ...props}) => (
            <blockquote className="border-l-4 border-primary-500/50 pl-4 italic text-text-tertiary my-5 bg-slate-800/30 py-3 rounded-r-lg">
              {children}
            </blockquote>
          ),
          
          // 代碼
          code: ({node, inline, children, ...props}) => {
            if (inline) {
              return (
                <code className="text-primary-300 bg-slate-800/70 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-700/50">
                  {children}
                </code>
              );
            }
            return (
              <code className="block text-primary-300 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono overflow-x-auto my-4">
                {children}
              </code>
            );
          },
        }}
        className="markdown-content"
      >
        {content || "暫無報告內容"}
      </ReactMarkdown>
    </div>
  );
}

