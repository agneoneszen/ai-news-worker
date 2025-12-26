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

  // 渲染每個區塊為獨立卡片
  console.log(`🎨 [MarkdownRenderer] 開始渲染 ${sections.length} 個卡片區塊`);
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {sections.map((section, index) => {
        const cleanTitle = section.title.replace(/[📊🌊🧭🔭📈🧱🔗]/g, '').trim();
        const icon = getIcon(cleanTitle);
        const IconComponent = icon;
        
        console.log(`🎨 [MarkdownRenderer] 渲染區塊 ${index + 1}/${sections.length}: ${section.title}`);
        
        // TL;DR 特殊樣式
        if (section.isTLDR) {
          return (
            <Card
              key={`section-${index}`}
              className="mb-8"
              padding="lg"
              rounded="2xl"
              border
              shadow
            >
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Icon 
                    icon={Zap} 
                    container 
                    containerSize="md"
                    color="primary"
                  />
                  <h2 className="text-2xl font-bold text-primary-300 m-0">
                    {section.title}
                  </h2>
                </div>
              </div>
              <div className="text-center">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={getMarkdownComponents()}
                  className="markdown-content"
                >
                  {section.content}
                </ReactMarkdown>
              </div>
            </Card>
          );
        }
        
        // 其他區塊的卡片樣式
        return (
          <Card
            key={`section-${index}`}
            className="mb-8"
            padding="lg"
            rounded="xl"
            border
            shadow
          >
            <div className="flex items-center justify-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
              <div className="p-2.5 bg-primary-500/20 rounded-lg border-2 border-primary-500/40 flex-shrink-0 shadow-md">
                <IconComponent size={20} className="text-primary-300" />
              </div>
              <h2 className="text-xl font-bold text-primary-300 m-0 text-center">
                {section.title}
              </h2>
            </div>
            <div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={getMarkdownComponents()}
                className="markdown-content"
              >
                {section.content}
              </ReactMarkdown>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// Markdown 組件配置（提取為函數以便復用）
function getMarkdownComponents() {
  return {
    // H3 樣式 - 子標題（置中）
    h3: ({node, children, ...props}) => (
      <h3 className="text-lg font-semibold text-primary-200 mt-6 mb-4 flex items-center justify-center gap-2">
        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
        {children}
      </h3>
    ),
    
    // 段落樣式 - 置中排版
    p: ({node, children, ...props}) => (
      <p className="text-text-secondary leading-relaxed mb-5 text-base text-center max-w-3xl mx-auto">
        {children}
      </p>
    ),
    
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
    
    // 無序列表 - 置中排版
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
    
    // 列表項 - 支持 checkbox
    li: ({node, children, ...props}) => {
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
      
      return (
        <li className="text-text-secondary my-2 pl-2 leading-relaxed text-center">
          {children}
        </li>
      );
    },
    
    // 有序列表
    ol: ({node, children, ...props}) => (
      <ol className="space-y-3 my-5 mx-auto max-w-3xl list-decimal marker:text-primary-500">
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
      <blockquote className="border-l-4 border-primary-500/50 pl-4 italic text-text-tertiary my-5 bg-slate-800/30 py-3 rounded-r-lg max-w-3xl mx-auto">
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
        <code className="block text-primary-300 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono overflow-x-auto my-4 max-w-3xl mx-auto">
          {children}
        </code>
      );
    },
  };
}
