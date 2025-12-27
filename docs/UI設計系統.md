# AI News Worker UI 設計系統文檔

## 📋 目錄
1. [設計系統概述](#設計系統概述)
2. [顏色系統](#顏色系統)
3. [字體與排版](#字體與排版)
4. [組件架構](#組件架構)
5. [布局結構](#布局結構)
6. [交互模式](#交互模式)
7. [響應式設計](#響應式設計)
8. [動畫與過渡](#動畫與過渡)
9. [組件使用指南](#組件使用指南)
10. [設計原則](#設計原則)

---

## 設計系統概述

### 設計理念
AI News Worker 採用**資訊優先（Information-First）**的設計理念，專注於：
- **清晰閱讀**：優化文字對比度和行高，確保長時間閱讀舒適
- **專業簡約**：使用淺色背景和清晰的層級，營造專業的資訊閱讀體驗
- **高效瀏覽**：可摺疊卡片、智能搜索、日期過濾，快速定位所需資訊

### 技術棧
- **框架**：React 18+ (Vite)
- **樣式**：Tailwind CSS 3+
- **圖標**：Lucide React
- **Markdown**：ReactMarkdown + remark-gfm

---

## 顏色系統

### 主色調（Primary Color Palette）

#### 1. 基底色 - Slate（灰藍色系）
用於背景和卡片，營造專業、清晰的視覺感受。

```css
slate-50:  #f8fafc  /* 頁面主背景 */
slate-100: #f1f5f9  /* 卡片背景、次要背景 */
slate-200: #e2e8f0  /* 邊框、分隔線 */
slate-300: #cbd5e1  /* 次要邊框 */
slate-400: #94a3b8  /* 輔助文字 */
slate-500: #64748b  /* 次要文字 */
slate-600: #475569  /* 次要標題 */
slate-700: #334155  /* 主要文字 */
slate-900: #0f172a  /* 標題文字 */
```

**使用場景**：
- `bg-slate-50`：頁面主背景
- `bg-white`：卡片背景、輸入框背景
- `bg-slate-100`：次要卡片背景、展開內容區
- `border-slate-200`：卡片邊框、輸入框邊框
- `text-slate-700`：主要內容文字
- `text-slate-500`：輔助文字、時間戳

#### 2. 主色調 - Blue（天空藍）
用於主要操作按鈕、連結和強調元素。

```css
blue-50:  #eff6ff  /* 淺色背景（標籤、提示） */
blue-100: #dbeafe  /* 更淺的背景 */
blue-200: #bfdbfe  /* 邊框 */
blue-400: #60a5fa  /* 圖標、次要按鈕 */
blue-500: #3b82f6  /* 主要品牌色/主按鈕 */
blue-600: #2563eb  /* 深色 hover */
blue-700: #1d4ed8  /* 深色 active */
```

**使用場景**：
- `bg-blue-500`：主要操作按鈕（浮動按鈕、確認按鈕）
- `bg-blue-50`：標籤背景、日期標籤背景
- `text-blue-500`：連結文字、圖標顏色
- `text-blue-600`：強調文字
- `border-blue-200`：標籤邊框

#### 3. 強調色 - Red（紅色）
用於警告、錯誤、刪除操作。

```css
red-50:  #fef2f2  /* 錯誤背景 */
red-200: #fecaca  /* 錯誤邊框 */
red-500: #ef4444  /* 錯誤文字、刪除按鈕 */
red-600: #dc2626  /* 深色 hover */
red-700: #b91c1c  /* 深色 active */
```

**使用場景**：
- `bg-red-50`：錯誤提示背景
- `text-red-500`：錯誤文字
- `border-red-200`：錯誤邊框

#### 4. 狀態色 - Green（綠色）
用於成功狀態、連線指示。

```css
green-500: #22c55e  /* 連線指示、成功狀態 */
```

**使用場景**：
- `bg-green-500`：連線指示器圓點
- `text-green-500`：成功狀態文字

#### 5. 標籤色 - Yellow（黃色）
用於版本標籤、警告提示。

```css
yellow-100: #fef3c7  /* 版本標籤背景 */
yellow-700: #a16207  /* 版本標籤文字 */
```

**使用場景**：
- `bg-yellow-100 text-yellow-700`：版本標籤

### 語義顏色（Semantic Colors）
- `white`：卡片背景、按鈕文字
- `black/60`：Modal 遮罩背景（未來擴展）

---

## 字體與排版

### 字體家族
```css
font-sans: 'Inter', system-ui, -apple-system, sans-serif
font-mono: 'JetBrains Mono', 'Fira Code', monospace
```
使用 Inter 無襯線字體確保現代感和可讀性，等寬字體用於版本號、時間戳。

### 字體大小與權重

#### 標題層級
```css
text-xl  font-bold      /* 頁面主標題（Daily Insight） */
text-lg  font-semibold  /* 卡片標題、區塊標題 */
text-base font-semibold /* H3 子標題 */
```

#### 正文層級
```css
text-sm  font-normal    /* 主要內容文字（14px） */
text-xs  font-medium    /* 次要內容、標籤（12px） */
text-[10px] font-bold   /* 極小文字（版本號、底部導航） */
```

#### 特殊字體
```css
font-mono  /* 版本號、時間戳 */
```

### 行高與間距
- **標題**：`leading-tight`（緊湊）
- **正文**：`leading-6`（24px，標準行高）
- **長文本**：`leading-relaxed`（寬鬆，用於 Markdown 內容）

### 字距
- **標籤**：`tracking-wide`（0.025em）
- **標題**：`tracking-tight`（-0.025em）

---

## 組件架構

### 組件目錄結構
```
src/components/
├── NewsCard/              # 新聞卡片組件
│   ├── NewsCard.jsx            # 主卡片（可摺疊）
│   ├── NewsCardHeader.jsx     # 卡片標題欄
│   ├── NewsCardContent.jsx    # 卡片內容區
│   ├── NewsCardFooter.jsx     # 卡片底部統計
│   └── NewsCardPreview.jsx    # 卡片預覽（未使用）
├── common/                # 通用組件
│   ├── SearchBar.jsx          # 搜索欄
│   ├── DateSelector.jsx       # 日期選擇器
│   ├── BottomNav.jsx          # 底部導航欄
│   ├── MarkdownRenderer.jsx   # Markdown 渲染器
│   └── DebugInfo.jsx          # 調試信息
├── ui/                    # UI 基礎組件
│   ├── Card.jsx               # 卡片容器
│   ├── Badge.jsx              # 標籤
│   ├── Icon.jsx               # 圖標包裝
│   └── Section.jsx            # 區塊容器
└── VersionInfo.jsx         # 版本信息
```

### 核心組件規範

#### 1. NewsCard（新聞卡片）
**用途**：顯示每日 AI 分析報告

**樣式規範**：
```jsx
<article className="
  bg-white 
  rounded-lg 
  border border-slate-200 
  overflow-hidden 
  shadow-sm 
  hover:shadow-md 
  transition-all duration-200
">
  {/* 預覽頭部 */}
  <div className="p-4 cursor-pointer hover:bg-slate-50">
    {/* 內容 */}
  </div>
  {/* 展開內容 */}
  <div className="border-t border-slate-200 bg-slate-50">
    {/* 詳細內容 */}
  </div>
</article>
```

**尺寸**：
- **圓角**：`rounded-lg`（8px）
- **間距**：`p-4`（16px 內邊距）
- **卡片間距**：`space-y-4`（16px）

#### 2. SearchBar（搜索欄）
**用途**：搜索報告內容

**樣式規範**：
```jsx
<input className="
  w-full 
  pl-10 pr-4 py-2.5 
  bg-white 
  border border-slate-200 
  rounded-lg 
  text-slate-700 
  placeholder-slate-400 
  focus:outline-none 
  focus:ring-2 focus:ring-blue-500 
  focus:border-transparent
" />
```

**尺寸**：
- **高度**：`py-2.5`（10px 垂直 padding）
- **圓角**：`rounded-lg`（8px）
- **圖標**：`pl-10`（左側 40px 留給圖標）

#### 3. DateSelector（日期選擇器）
**用途**：橫向滾動的日期按鈕

**樣式規範**：
```jsx
<button className={`
  flex-shrink-0 
  px-4 py-2 
  rounded-lg 
  font-medium text-sm 
  transition-all duration-200
  ${isSelected 
    ? 'bg-blue-500 text-white shadow-md' 
    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
  }
`}>
```

**尺寸**：
- **Padding**：`px-4 py-2`（16px 8px）
- **圓角**：`rounded-lg`（8px）
- **間距**：`gap-2`（8px）

#### 4. BottomNav（底部導航欄）
**用途**：固定底部導航

**樣式規範**：
```jsx
<nav className="
  fixed bottom-0 left-0 right-0 
  bg-white 
  border-t border-slate-200 
  z-50
">
  <button className={`
    relative 
    flex flex-col items-center gap-1 
    px-4 py-2 
    transition-colors
    ${isActive ? 'text-blue-500' : 'text-slate-500'}
  `}>
    <Icon size={20} />
    <span className="text-xs font-medium">{label}</span>
    {isActive && (
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full" />
    )}
  </button>
</nav>
```

**尺寸**：
- **圖標**：`size={20}`（20px）
- **文字**：`text-xs`（12px）
- **指示器**：`w-8 h-0.5`（32px × 2px）

#### 5. FloatingButton（浮動操作按鈕）
**用途**：快速操作（未來擴展）

**樣式規範**：
```jsx
<button className="
  fixed bottom-20 right-4 
  w-14 h-14 
  bg-blue-500 
  text-white 
  rounded-full 
  shadow-lg 
  hover:bg-blue-600 
  transition-colors 
  flex items-center justify-center 
  z-40
">
  <Plus size={24} />
</button>
```

**尺寸**：
- **大小**：`w-14 h-14`（56px × 56px）
- **位置**：`bottom-20 right-4`（距離底部 80px，右側 16px）

#### 6. MarkdownRenderer（Markdown 渲染器）
**用途**：渲染 AI 生成的 Markdown 內容

**樣式規範**：
```jsx
<div className="space-y-6 max-w-4xl mx-auto">
  {/* TL;DR 區塊 */}
  <article className="
    bg-blue-50 
    rounded-lg 
    border-2 border-blue-200 
    p-6 mb-6 
    shadow-sm 
    hover:shadow-md
  ">
    {/* 內容 */}
  </article>
  {/* 其他區塊 */}
  <article className="
    bg-white 
    rounded-lg 
    border border-slate-200 
    p-5 mb-4 
    shadow-sm 
    hover:shadow-md
  ">
    {/* 內容 */}
  </article>
</div>
```

**文字樣式**：
- **H3**：`text-base font-semibold text-slate-900`
- **段落**：`text-slate-700 leading-6 text-sm`
- **列表**：`text-slate-700 leading-6`
- **連結**：`text-blue-600 hover:text-blue-700`

---

## 布局結構

### 頁面層級

#### 1. 主列表頁
```
┌─────────────────────────┐
│ [返回] [標題] [版本][分享][菜單]│
│ [連線] [日期範圍]       │
│ [搜索欄]                │
│ [日期標籤橫向滾動]      │
│ ┌─────────────────────┐ │
│ │ 報告卡片（摺疊）     │ │
│ │ - 日期標籤          │ │
│ │ - 摘要預覽          │ │
│ │ - 統計信息          │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 報告卡片（摺疊）     │ │
│ └─────────────────────┘ │
│                        │
│              [+ 浮動按鈕]│
│ [報告][分析][地圖][設定]│
└─────────────────────────┘
```

#### 2. 卡片展開狀態
```
┌─────────────────────────┐
│ [日期標籤] [AI標籤]     │
│ ──────────────────────── │
│ ## 今日三句話（TL;DR）   │
│ - 要點1                 │
│ - 要點2                 │
│ - 要點3                 │
│ ──────────────────────── │
│ ## 市場情緒儀表板        │
│ - 情緒：...              │
│ - 熱詞：...              │
│ ──────────────────────── │
│ [統計] [分類標籤]        │
└─────────────────────────┘
```

### 間距系統
- **頁面邊距**：`px-4`（16px）或 `px-6`（24px）
- **卡片間距**：`space-y-4`（16px）
- **內部間距**：`p-4`（16px）或 `p-6`（24px）
- **小間距**：`gap-2`（8px）或 `gap-3`（12px）

### 容器寬度
- **最大寬度**：`max-w-4xl`（896px）
- **居中**：`mx-auto`

---

## 交互模式

### 1. 點擊交互
- **按鈕**：`hover:bg-slate-100`（懸停背景變化）
- **卡片**：`hover:shadow-md`（懸停陰影增強）
- **日期按鈕**：`hover:bg-slate-200`（懸停背景變化）

### 2. 摺疊/展開交互
- **卡片**：點擊卡片頭部展開/摺疊
- **動畫**：`transition-all duration-200`（200ms 過渡）

### 3. 表單交互
- **焦點狀態**：`focus:ring-2 focus:ring-blue-500`
- **禁用狀態**：`disabled:bg-gray-100 disabled:cursor-not-allowed`

### 4. 搜索交互
- **實時搜索**：輸入即過濾
- **清空搜索**：清空輸入框自動重置

---

## 響應式設計

### 斷點（Breakpoints）
使用 Tailwind 默認斷點：
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### 響應式策略

#### 1. 容器寬度
```jsx
<div className="max-w-4xl mx-auto px-4 sm:px-6">
```
- 手機：`px-4`（16px）
- 平板以上：`sm:px-6`（24px）

#### 2. 文字大小
- 標題：保持 `text-xl`（20px）
- 正文：保持 `text-sm`（14px）

#### 3. 卡片布局
- 單列布局，響應式間距

---

## 動畫與過渡

### 自定義動畫
定義於 `tailwind.config.js`：

```javascript
animation: {
  'fade-in': 'fadeIn 0.3s ease-in-out',
  'slide-up': 'slideUp 0.3s ease-out',
}
```

### 過渡效果
- **顏色過渡**：`transition-colors`（顏色變化）
- **所有過渡**：`transition-all duration-200`（200ms）
- **陰影過渡**：`hover:shadow-md transition-all`

### 動畫使用場景
- **卡片展開**：`transition-all duration-200`
- **按鈕懸停**：`hover:bg-blue-600 transition-colors`
- **列表項**：`animate-fade-in`（未來擴展）

---

## 組件使用指南

### 1. 創建新卡片組件
```jsx
<article className="
  bg-white 
  rounded-lg 
  border border-slate-200 
  p-4 
  shadow-sm 
  hover:shadow-md 
  transition-all duration-200
">
  {/* 內容 */}
</article>
```

### 2. 創建新按鈕
```jsx
<button className="
  bg-blue-500 
  text-white 
  px-4 py-2 
  rounded-lg 
  font-medium 
  hover:bg-blue-600 
  transition-colors
">
  按鈕文字
</button>
```

### 3. 創建新輸入框
```jsx
<input 
  type="text"
  className="
    w-full 
    px-4 py-2.5 
    bg-white 
    border border-slate-200 
    rounded-lg 
    text-sm 
    text-slate-700 
    placeholder-slate-400 
    focus:outline-none 
    focus:ring-2 focus:ring-blue-500 
    focus:border-transparent
  "
/>
```

### 4. 創建新標籤
```jsx
<span className="
  px-3 py-1.5 
  bg-blue-50 
  border border-blue-200 
  rounded-lg 
  text-sm font-semibold 
  text-blue-700
">
  標籤文字
</span>
```

---

## 設計原則

### 1. 一致性（Consistency）
- 使用統一的顏色系統（Slate + Blue）
- 保持相同的間距和圓角（8px, 16px, 24px）
- 統一的交互模式（hover, focus, transition）

### 2. 層級清晰（Hierarchy）
- 使用字體大小和權重區分層級
- 使用顏色突出重要元素（Blue 500）
- 使用陰影和間距創建深度

### 3. 可訪問性（Accessibility）
- 確保顏色對比度足夠（WCAG AA）
- 按鈕有足夠的點擊區域（至少 44x44px）
- 提供清晰的視覺反饋

### 4. 性能優化（Performance）
- 使用 CSS 過渡而非 JavaScript 動畫
- 避免過度使用陰影和模糊效果
- 優化 Markdown 渲染性能

### 5. 資訊優先（Information-First）
- 優化文字可讀性（行高、字體大小）
- 清晰的視覺層級
- 高效的內容瀏覽（搜索、過濾、摺疊）

---

## 特殊組件規範

### 1. 新聞卡片（NewsCard）
```jsx
<article className="
  bg-white 
  rounded-lg 
  border border-slate-200 
  overflow-hidden 
  shadow-sm 
  hover:shadow-md 
  transition-all duration-200
">
  {/* 預覽頭部 - 可點擊 */}
  <div className="p-4 cursor-pointer hover:bg-slate-50">
    {/* 日期標籤、摘要、統計 */}
  </div>
  {/* 展開內容 */}
  {isExpanded && (
    <div className="border-t border-slate-200 bg-slate-50">
      {/* Markdown 內容 */}
    </div>
  )}
</article>
```

### 2. 日期選擇器按鈕（DateSelector）
```jsx
<button className={`
  flex-shrink-0 
  px-4 py-2 
  rounded-lg 
  font-medium text-sm 
  transition-all duration-200
  ${isSelected 
    ? 'bg-blue-500 text-white shadow-md' 
    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
  }
`}>
  <div className="flex items-center gap-2">
    <span className="text-xs">週一</span>
    <span className="text-xs font-normal">MON</span>
    <span className="text-sm font-semibold">12/15</span>
    {isSelected && <X size={14} />}
  </div>
</button>
```

### 3. Markdown 區塊卡片
```jsx
{/* TL;DR 特殊樣式 */}
<article className="
  bg-blue-50 
  rounded-lg 
  border-2 border-blue-200 
  p-6 mb-6 
  shadow-sm 
  hover:shadow-md
">
  <header className="mb-4 pb-3 border-b border-blue-200">
    <h2 className="text-xl font-bold text-blue-900">
      今日三句話（TL;DR）
    </h2>
  </header>
  {/* 內容 */}
</article>

{/* 其他區塊 */}
<article className="
  bg-white 
  rounded-lg 
  border border-slate-200 
  p-5 mb-4 
  shadow-sm 
  hover:shadow-md
">
  <header className="mb-4 pb-3 border-b border-slate-200">
    <h2 className="text-lg font-semibold text-slate-900">
      區塊標題
    </h2>
  </header>
  {/* 內容 */}
</article>
```

---

## 圖標系統

### 圖標庫
使用 **Lucide React**，統一樣式：
- **大小**：通常 14px、18px、20px、24px
- **顏色**：跟隨文字顏色或使用語義顏色
- **間距**：與文字間距 `gap-2`（8px）

### 常用圖標
- `Plus`：新增、浮動按鈕
- `ChevronDown/Up`：展開/摺疊
- `Search`：搜索
- `Calendar`：日期
- `Clock`：時間
- `FileText`：報告
- `BarChart3`：分析
- `Map`：地圖
- `Settings`：設定
- `ArrowLeft`：返回
- `Users`：分享
- `MoreVertical`：更多選項
- `Zap`：AI 處理
- `TrendingUp`：統計
- `ExternalLink`：外部連結

---

## 最佳實踐

### ✅ 應該做的
1. 使用設計系統中的顏色和間距
2. 保持組件的一致性
3. 確保響應式設計
4. 提供清晰的視覺反饋
5. 使用語義化的類名
6. 優化文字可讀性（行高、字體大小）

### ❌ 不應該做的
1. 不要使用硬編碼的顏色值
2. 不要跳過設計系統的間距
3. 不要忽略移動端體驗
4. 不要使用過度複雜的動畫
5. 不要忽略可訪問性
6. 不要在淺色背景上使用淺色文字

---

## 未來改進方向

1. **深色模式**：擴展顏色系統支援深色主題
2. **設計令牌**：將顏色和間距抽象為設計令牌
3. **組件庫**：建立完整的組件庫文檔和 Storybook
4. **動畫系統**：建立統一的動畫規範
5. **無障礙性**：增強 ARIA 標籤和鍵盤導航
6. **打印樣式**：優化報告打印樣式

---

## 參考資源

- **Tailwind CSS 文檔**：https://tailwindcss.com/docs
- **Lucide Icons**：https://lucide.dev/icons
- **ReactMarkdown**：https://github.com/remarkjs/react-markdown
- **設計系統範例**：Material Design, Ant Design, Travel OS

---

**文檔版本**：1.0  
**最後更新**：2025-12-27  
**維護者**：AI News Worker 開發團隊

