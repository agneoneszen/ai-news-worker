# 🤖 AI News Worker

一個自動化的 AI 新聞聚合與分析系統，每日自動抓取科技與加密貨幣新聞，並使用 OpenAI 生成深度分析報告。

## ✨ 功能特色

- 📰 **自動新聞抓取**: 從 The Verge、CoinDesk 等來源抓取最新新聞
- 🧠 **AI 智能分析**: 使用 OpenAI GPT-4o-mini 分析每篇新聞
- 📊 **每日決策日報**: 自動生成包含市場情緒、趨勢分析、決策建議的 Markdown 報告
- 🔥 **即時同步**: 前端透過 Firebase Firestore 即時顯示最新報告
- 🎨 **現代化 UI**: 使用 React + Tailwind CSS 打造的美觀介面

## 🏗️ 專案結構

```
ai-news-worker/
├── backend/              # Python 後端服務
│   ├── scheduler.py     # 主排程器（每日任務）
│   ├── scraper.py       # RSS 新聞抓取
│   ├── ai_service.py    # OpenAI 分析服務
│   └── requirements.txt # Python 依賴
├── frontend/            # React 前端應用
│   ├── src/
│   │   ├── App.jsx      # 主應用程式
│   │   ├── components/  # React 元件
│   │   └── hooks/       # 自訂 Hooks
│   └── package.json     # Node.js 依賴
└── DEPLOYMENT.md        # 詳細部署指南
```

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

詳細的部署指南請參考 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 快速部署選項

- **前端**: Vercel / Netlify (推薦 Vercel)
- **後端**: Railway / Render / Docker (推薦 Railway)

## 🔧 技術棧

### 後端
- Python 3.9
- Firebase Admin SDK
- OpenAI API
- feedparser (RSS 解析)

### 前端
- React 18
- Vite
- Tailwind CSS
- Firebase Client SDK
- React Markdown

## 📝 工作流程

1. **排程觸發**: 每日定時執行 `scheduler.py`
2. **新聞抓取**: 從 RSS 來源抓取最新新聞
3. **AI 分析**: 每篇新聞透過 OpenAI 分析分類、摘要、洞察
4. **生成日報**: 彙整所有分析結果，生成 Markdown 格式的決策日報
5. **寫入資料庫**: 將日報存入 Firebase Firestore
6. **前端顯示**: 使用者透過網頁即時查看最新報告

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

