# 🤖 AI News Worker

一個自動化的 AI 新聞聚合與分析系統，每日自動抓取科技與加密貨幣新聞，並使用 OpenAI 生成深度分析報告。

## ✨ 功能特色

- 📰 **自動新聞抓取**: 從 The Verge、CoinDesk 等來源抓取過去24小時內的新聞
- 🧠 **AI 智能分析**: 使用 OpenAI GPT-4o-mini 進行分類、統合分析和決策日報生成
- 📊 **分類統合**: 將同類文章合併分析，最多5個分類，提供深度洞察
- 🔍 **可追溯證據**: 每個結論都有證據支持，降低幻覺風險
- 🎯 **決策導向**: 提供具體的行動建議、監測信號和風險提醒
- 🔥 **即時同步**: 前端透過 Firebase Firestore 即時顯示最新報告
- 🎨 **現代化 UI**: 使用 React + Tailwind CSS 打造的美觀介面

## 🏗️ 專案結構

```
ai-news-worker/
├── backend/              # Python 後端服務
│   ├── scheduler.py     # 主排程器（一次性執行）
│   ├── scheduler_continuous.py  # 長期運行排程器
│   ├── scraper.py       # RSS 新聞抓取（24小時過濾）
│   ├── ai_service.py    # OpenAI 分析服務（優化版 prompts）
│   └── requirements.txt # Python 依賴
│
├── frontend/            # React 前端應用
│   ├── src/
│   │   ├── App.jsx      # 主應用程式
│   │   ├── components/  # React 元件
│   │   └── hooks/       # 自訂 Hooks
│   └── package.json     # Node.js 依賴
│
├── docs/                # 📚 文檔目錄
│   ├── deployment/      # 部署相關文檔
│   └── guides/          # 使用指南
│
└── scripts/             # 🔧 部署腳本
```

詳細結構請參考：[專案結構說明](./docs/專案結構說明.md)

## 🚀 快速開始

### 前置需求

- Python 3.9+
- Node.js 16+
- Firebase 專案
- OpenAI API Key

### 本地開發

#### 1. 後端設定

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 設定環境變數
echo "OPENAI_API_KEY=your_key_here" > .env

# 確保 serviceAccountKey.json 存在於 backend/ 目錄
# 從 Firebase Console 下載服務帳號金鑰

# 執行一次測試
python scheduler.py
```

#### 2. 前端設定

```bash
cd frontend
npm install

# 設定 Firebase 配置
# 編輯 src/firebase.js 或使用環境變數
# 建立 .env 檔案：
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_AUTH_DOMAIN=...
# VITE_FIREBASE_PROJECT_ID=...
# VITE_FIREBASE_STORAGE_BUCKET=...
# VITE_FIREBASE_MESSAGING_SENDER_ID=...
# VITE_FIREBASE_APP_ID=...

# 啟動開發伺服器
npm run dev
```

## 📦 部署

詳細的部署指南請參考：

- **完整部署指南**: [docs/deployment/DEPLOYMENT.md](./docs/deployment/DEPLOYMENT.md)
- **快速開始**: [docs/guides/QUICK_START.md](./docs/guides/QUICK_START.md)

### 快速部署選項

- **前端**: Vercel / Netlify (推薦 Vercel)
- **後端**: Railway / Render / Docker (推薦 Railway)

## 🔧 技術棧

### 後端
- Python 3.9
- Firebase Admin SDK
- OpenAI API (GPT-4o-mini)
- feedparser (RSS 解析)
- python-dateutil (時間解析)
- schedule (排程管理)

### 前端
- React 18
- Vite
- Tailwind CSS
- Firebase Client SDK
- React Markdown

## 📝 工作流程

### 優化後的新流程

1. **抓取過去24小時的新聞**: 從 RSS 來源抓取，只保留24小時內的文章
2. **AI 分類**: 每篇文章進行 AI 分析，提取分類、摘要、重點、實體、情緒等
3. **分類分組**: 將同類文章分組（最多5個分類）
4. **統合分析**: 對每個分類進行深度分析，生成主線、風險、機會、監測信號
5. **生成日報**: 根據分類分析結果生成完整的決策日報（包含 TL;DR、市場情緒、趨勢、決策指引、監測清單、反方觀點）
6. **寫入資料庫**: 將日報存入 Firebase Firestore
7. **前端顯示**: 使用者透過網頁即時查看最新報告

詳細流程請參考：[新工作流程說明](./docs/guides/新工作流程說明.md)

## 🤖 LLM Prompts

系統使用優化版的 LLM prompts，具備：
- ✅ **可追溯**: 每個結論都有證據支持
- ✅ **可決策**: 提供具體的行動建議和監測信號
- ✅ **可控性**: 明確規則、避免幻覺
- ✅ **結構化**: JSON 格式輸出，便於處理

詳細 prompts 請參考：[LLM Prompts 優化版](./docs/guides/LLM_Prompts優化版.md)

## 🔐 環境變數

### 後端 (.env)
```
OPENAI_API_KEY=your_openai_api_key
```

### 前端 (.env)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 📄 授權

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

**注意**: 請確保 `serviceAccountKey.json` 和 `.env` 檔案已加入 `.gitignore`，不要提交到版本控制系統。
