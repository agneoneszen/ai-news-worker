# UI 規格分析 - 參考 Travel OS 設計

## Step 1: UI 規格化

### Layout（佈局）
- **容器寬度**: max-w-4xl (896px)
- **Header padding**: px-4 py-3 (16px 12px)
- **Main padding**: px-4 py-4 (16px 16px)
- **Card padding**: p-4 (16px)
- **Card gap**: space-y-4 (16px)
- **Header gap**: gap-2, gap-3 (8px, 12px)
- **對齊方式**: flex items-center, justify-between
- **Breakpoints**: sm:px-6 (≥640px)

### Typography（字體）
- **標題 (H1)**: text-lg (18px), font-semibold (600)
- **副標題**: text-xs (12px), text-slate-500
- **日期標籤**: text-sm (14px), font-semibold
- **正文**: text-sm (14px), leading-6 (24px)
- **按鈕文字**: text-xs (12px), font-medium
- **行高**: leading-6 (24px)
- **字距**: tracking-wide (0.025em)

### Colors（顏色）
- **背景主色**: bg-white (#ffffff)
- **背景次色**: bg-slate-50 (#f8fafc)
- **文字主色**: text-slate-900 (#0f172a)
- **文字次色**: text-slate-600 (#475569)
- **文字輔助**: text-slate-500 (#64748b)
- **邊框**: border-slate-200 (#e2e8f0)
- **主色調**: blue-500 (#3b82f6)
- **主色調淺**: blue-50 (#eff6ff)
- **主色調深**: blue-600 (#2563eb)
- **連線指示**: green-500 (#22c55e)
- **版本標籤**: yellow-100 (#fef3c7), yellow-700 (#a16207)
- **Hover**: hover:bg-slate-100 (#f1f5f9)
- **Active**: bg-blue-500, text-white

### Components（元件）

#### Header
- **高度**: py-3 (12px vertical padding)
- **邊框**: border-b border-slate-200
- **陰影**: shadow-sm
- **Sticky**: sticky top-0 z-20

#### Search Bar
- **高度**: py-2.5 (10px)
- **圓角**: rounded-lg (8px)
- **邊框**: border border-slate-200
- **圖標**: left-0 pl-3, size 18px
- **Focus ring**: focus:ring-2 focus:ring-blue-500

#### Date Selector Button
- **Padding**: px-4 py-2 (16px 8px)
- **圓角**: rounded-lg (8px)
- **選中狀態**: bg-blue-500, text-white, shadow-md
- **未選中**: bg-slate-100, text-slate-700
- **Hover**: hover:bg-slate-200

#### Card
- **背景**: bg-white
- **圓角**: rounded-lg (8px)
- **邊框**: border border-slate-200
- **陰影**: shadow-sm
- **Hover**: hover:shadow-md
- **Padding**: p-4 (16px)

#### Bottom Nav
- **高度**: py-2 (8px)
- **邊框**: border-t border-slate-200
- **圖標**: size 20px
- **文字**: text-xs (12px)
- **Active indicator**: w-8 h-0.5 bg-blue-500

#### Floating Button
- **大小**: w-14 h-14 (56px)
- **圓角**: rounded-full
- **位置**: fixed bottom-24 right-4
- **陰影**: shadow-lg

### Spacing Scale（間距系統）
- **xs**: 2px (gap-0.5)
- **sm**: 4px (gap-1)
- **md**: 8px (gap-2)
- **lg**: 12px (gap-3)
- **xl**: 16px (gap-4, p-4)
- **2xl**: 24px (gap-6)
- **3xl**: 32px (py-8)

### Interactions（互動）
- **Hover**: transition-colors, hover:bg-slate-100
- **Focus**: focus:ring-2 focus:ring-blue-500
- **Transition**: transition-all duration-200
- **Disabled**: opacity-50 cursor-not-allowed
- **Loading**: animate-spin

