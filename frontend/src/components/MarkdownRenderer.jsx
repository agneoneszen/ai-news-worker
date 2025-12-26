import React, { useMemo } from 'react';
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
import Card from './ui/Card';

/**
 * Markdown 渲染器組件
 * 將 Markdown 內容渲染為美觀的 UI
 * 每個 H2 標題及其內容成為獨立卡片
 */
export default function MarkdownRenderer({ content }) {
  // 調試：記錄內容格式
  React.useEffect(() => {
    console.log('🔍 [MarkdownRenderer] 內容長度:', content?.length || 0);
    console.log('🔍 [MarkdownRenderer] 內容前 500 字:', content?.substring(0, 500));
    console.log('🔍 [MarkdownRenderer] 是否包含 ## :', content?.includes('## '));
    const h2Matches = content?.match(/^##\s+.+$/gm) || [];
    console.log('🔍 [MarkdownRenderer] 找到的 H2 標題:', h2Matches);
    console.log('🔍 [MarkdownRenderer] H2 標題數量:', h2Matches.length);
  }, [content]);

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

  // 將內容分割成區塊（每個 H2 及其內容）
  const sections = useMemo(() => {
    if (!content) {
      console.log('⚠️ [MarkdownRenderer] 內容為空');
      return [];
    }
    
    const lines = content.split('\n');
    const sections = [];
    let currentSection = null;
    let currentContent = [];
    
    console.log('🔍 [MarkdownRenderer] 總行數:', lines.length);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 檢查是否為 H2 標題（## 開頭，可能前面有空格）
      // 支持多種格式：## 標題、##📊 標題、##  📊 標題
      const trimmedLine = line.trim();
      const isH2 = trimmedLine.startsWith('## ') || 
                   trimmedLine.match(/^##\s*[📊🌊🧭🔭📈🧱🔗]/) ||
                   (trimmedLine.startsWith('##') && trimmedLine.length > 2 && !trimmedLine.startsWith('###'));
      
      if (isH2) {
        // 保存上一個區塊
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: currentContent.join('\n').trim()
          });
          console.log(`✅ [MarkdownRenderer] 完成區塊: ${currentSection.title}, 內容長度: ${currentContent.join('\n').trim().length}`);
        }
        
        // 開始新區塊 - 移除所有 # 和開頭空格
        const title = trimmedLine.replace(/^#+\s*/, '').trim();
        currentSection = {
          title,
          isTLDR: title.includes('TL;DR') || title.includes('三句話') || title.includes('今日三句話')
        };
        currentContent = [];
        console.log(`📌 [MarkdownRenderer] 發現新區塊: ${title}`);
      } else if (trimmedLine.startsWith('### ')) {
        // H3 標題也加入當前區塊內容
        currentContent.push(line);
      } else {
        // 累積內容
        currentContent.push(line);
      }
    }
    
    // 保存最後一個區塊
    if (currentSection) {
      sections.push({
        ...currentSection,
        content: currentContent.join('\n').trim()
      });
      console.log(`✅ [MarkdownRenderer] 完成最後區塊: ${currentSection.title}, 內容長度: ${currentContent.join('\n').trim().length}`);
    }
    
    console.log(`📊 [MarkdownRenderer] 總共分割成 ${sections.length} 個區塊`);
    sections.forEach((section, idx) => {
      console.log(`  ${idx + 1}. ${section.title} (${section.content.length} 字元)`);
    });
    
    return sections;
  }, [content]);

  // 如果沒有找到 H2 區塊，使用原始渲染並顯示警告
  if (sections.length === 0) {
    console.warn('⚠️ [MarkdownRenderer] 未找到 H2 區塊，使用原始渲染');
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
          <p className="text-yellow-400 text-sm">
            ⚠️ 調試信息：未檢測到 H2 標題格式，使用原始 Markdown 渲染
          </p>
          <p className="text-yellow-500/70 text-xs mt-2">
            內容前 200 字: {content?.substring(0, 200)}
          </p>
        </div>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="markdown-content"
        >
          {content || "暫無報告內容"}
        </ReactMarkdown>
      </div>
    );
  }

  // 渲染每個區塊為獨立卡片 - 參考 Medium/Reddit 設計
  console.log(`🎨 [MarkdownRenderer] 開始渲染 ${sections.length} 個卡片區塊`);
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {sections.map((section, index) => {
        const cleanTitle = section.title.replace(/[📊🌊🧭🔭📈🧱🔗]/g, '').trim();
        const icon = getIcon(cleanTitle);
        const IconComponent = icon;
        
        console.log(`🎨 [MarkdownRenderer] 渲染區塊 ${index + 1}/${sections.length}: ${section.title}`);
        
        // TL;DR 特殊樣式 - 突出顯示
        if (section.isTLDR) {
          return (
            <article
              key={`section-${index}`}
              className="bg-gradient-to-br from-blue-500/15 via-blue-600/12 to-blue-500/15 rounded-2xl border-2 border-blue-500/40 p-8 mb-8 shadow-xl hover:shadow-2xl hover:border-blue-500/60 transition-all duration-200"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                borderColor: 'rgba(59, 130, 246, 0.4)',
              }}
            >
              <header className="mb-6 pb-4 border-b border-blue-500/30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/25 rounded-lg border border-blue-500/40">
                    <Zap size={20} className="text-blue-300" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-200 m-0">
                    {section.title}
                  </h2>
                </div>
              </header>
              <div className="prose prose-invert prose-blue max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={getMarkdownComponents()}
                  className="markdown-content"
                >
                  {section.content}
                </ReactMarkdown>
              </div>
            </article>
          );
        }
        
        // 其他區塊的卡片樣式 - 增強視覺效果
        return (
          <article
            key={`section-${index}`}
            className="bg-slate-800/80 rounded-xl border-2 border-slate-700/70 p-6 mb-6 shadow-lg hover:shadow-xl hover:border-slate-600/90 transition-all duration-200"
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.85)',
              borderColor: 'rgba(100, 116, 139, 0.7)',
            }}
          >
            <header className="mb-5 pb-4 border-b border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700/60 rounded-lg border border-slate-600/50">
                  <IconComponent size={18} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-100 m-0">
                  {section.title}
                </h2>
              </div>
            </header>
            <div className="prose prose-invert prose-slate max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={getMarkdownComponents()}
                className="markdown-content"
              >
                {section.content}
              </ReactMarkdown>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// Markdown 組件配置（提取為函數以便復用）- 參考現代資訊網站設計
function getMarkdownComponents() {
  return {
    // H3 樣式 - 子標題（左對齊，參考 Medium）
    h3: ({node, children, ...props}) => (
      <h3 className="text-lg font-semibold text-slate-100 mt-8 mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
        <span>{children}</span>
      </h3>
    ),
    
    // 段落樣式 - 左對齊，優化行高和間距（參考 Medium）
    p: ({node, children, ...props}) => (
      <p className="text-slate-300 leading-7 mb-4 text-base text-left">
        {children}
      </p>
    ),
    
    // 連結樣式 - 參考 Medium/Reddit
    a: ({node, href, children, ...props}) => (
      <a 
        {...props} 
        href={href}
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-medium underline decoration-blue-500/50 underline-offset-2 hover:decoration-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
      >
        {children}
        <ExternalLink size={12} className="inline opacity-70" />
      </a>
    ),
    
    // 無序列表 - 左對齊，優化間距（參考 Medium）
    ul: ({node, children, ...props}) => {
      const childrenArray = React.Children.toArray(children);
      const isChecklist = childrenArray.some(child => 
        React.isValidElement(child) && 
        React.Children.toArray(child.props.children).some(grandchild =>
          React.isValidElement(grandchild) && grandchild.type === 'input' && grandchild.props.type === 'checkbox'
        )
      );
      
      if (isChecklist) {
        return (
          <ul className="space-y-2.5 my-4 list-none pl-0">
            {children}
          </ul>
        );
      }
      
      return (
        <ul className="space-y-2 my-4 list-disc pl-6 marker:text-blue-400">
          {children}
        </ul>
      );
    },
    
    // 列表項 - 支持 checkbox，左對齊
    li: ({node, children, ...props}) => {
      const childrenArray = React.Children.toArray(children);
      
      // 檢查第一個子元素是否為 checkbox input（remark-gfm 的格式）
      if (childrenArray.length > 0) {
        const firstChild = childrenArray[0];
        if (React.isValidElement(firstChild) && firstChild.type === 'input' && firstChild.props.type === 'checkbox') {
          return (
            <li className="text-slate-300 my-2 leading-6 flex items-start gap-3 list-none">
              <input 
                type="checkbox" 
                checked={firstChild.props.checked || false}
                readOnly
                className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 cursor-default flex-shrink-0"
              />
              <span className="flex-1">{childrenArray.slice(1)}</span>
            </li>
          );
        }
      }
      
      return (
        <li className="text-slate-300 my-2 leading-6 text-left">
          {children}
        </li>
      );
    },
    
    // 有序列表 - 左對齊
    ol: ({node, children, ...props}) => (
      <ol className="space-y-2 my-4 list-decimal pl-6 marker:text-blue-400">
        {children}
      </ol>
    ),
    
    // 強調 - 參考 Medium
    strong: ({node, children, ...props}) => (
      <strong className="text-slate-100 font-semibold">
        {children}
      </strong>
    ),
    
    // 引用 - 參考 Medium 引用樣式
    blockquote: ({node, children, ...props}) => (
      <blockquote className="border-l-4 border-blue-500/50 pl-4 italic text-slate-400 my-6 bg-slate-800/30 py-3 rounded-r-lg">
        {children}
      </blockquote>
    ),
    
    // 代碼 - 優化樣式
    code: ({node, inline, children, ...props}) => {
      if (inline) {
        return (
          <code className="text-blue-300 bg-slate-800/80 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-700/50">
            {children}
          </code>
        );
      }
      return (
        <code className="block text-slate-200 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono overflow-x-auto my-4">
          {children}
        </code>
      );
    },
  };
}
