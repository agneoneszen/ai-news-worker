# UI 差異比對與修正方案

## Step 2: 差異比對（參考 Travel OS vs 目前實作）

### 差異點 1: Header 標題字體大小
- **參考 UI**: 標題應為 `text-xl` (20px) 或更大，字重 `font-bold` (700)
- **目前 UI**: `text-lg` (18px), `font-semibold` (600)
- **修正方式**: `App.jsx` line 69，改為 `text-xl font-bold`

### 差異點 2: Header 連線狀態指示器
- **參考 UI**: 綠色圓點應為 `w-2 h-2`，位置在文字前
- **目前 UI**: `w-2 h-2` ✓ (已正確)
- **修正方式**: 無需修正

### 差異點 3: 版本標籤樣式
- **參考 UI**: 黃色背景 `bg-yellow-100`，文字 `text-yellow-700`，padding `px-2 py-1`
- **目前 UI**: `bg-yellow-100 text-yellow-700 px-2 py-1` ✓ (已正確)
- **修正方式**: 無需修正

### 差異點 4: 搜索欄 placeholder 前綴
- **參考 UI**: 應有 "Q " 前綴
- **目前 UI**: `placeholder="Q 搜尋報告內容..."` ✓ (已正確)
- **修正方式**: 無需修正

### 差異點 5: 日期選擇器按鈕間距
- **參考 UI**: 按鈕之間應有適當間距 `gap-2` (8px)
- **目前 UI**: `gap-2` ✓ (已正確)
- **修正方式**: 無需修正

### 差異點 6: 卡片內容區域 padding
- **參考 UI**: 卡片展開後內容區應為 `p-6` (24px)
- **目前 UI**: `p-6 sm:p-8` (24px/32px)
- **修正方式**: `NewsCardContent.jsx` line 10，統一為 `p-6`

### 差異點 7: 卡片時間顯示格式
- **參考 UI**: 應顯示時間範圍（如 "13:30 14:30"）
- **目前 UI**: 無時間顯示
- **修正方式**: 需要添加時間提取和顯示邏輯

### 差異點 8: 卡片類別圖標容器
- **參考 UI**: 圖標應有背景容器，圓角 `rounded-lg`，padding `p-2`
- **目前 UI**: `p-2 bg-blue-50 rounded-lg border border-blue-200` ✓ (已正確)
- **修正方式**: 無需修正

### 差異點 9: 底部導航欄 active 指示器位置
- **參考 UI**: Active 指示器應在按鈕底部中央
- **目前 UI**: `absolute bottom-0` 但需要調整父容器為 `relative`
- **修正方式**: `BottomNav.jsx`，為按鈕添加 `relative` 類

### 差異點 10: 浮動按鈕位置
- **參考 UI**: 應在底部導航欄上方，距離底部約 80px
- **目前 UI**: `bottom-24` (96px) - 可能需要調整
- **修正方式**: 調整為 `bottom-20` (80px) 或根據實際底部導航高度調整

### 差異點 11: Markdown 內容文字顏色
- **參考 UI**: 淺色主題應使用深色文字
- **目前 UI**: `text-slate-300` (淺色，不適合淺色背景)
- **修正方式**: `index.css` 和 `MarkdownRenderer.jsx`，改為 `text-slate-700`

### 差異點 12: 卡片刪除按鈕
- **參考 UI**: 卡片右上角應有刪除按鈕（垃圾桶圖標）
- **目前 UI**: 無刪除按鈕
- **修正方式**: 在 `NewsCard.jsx` 添加刪除按鈕（可選功能）

