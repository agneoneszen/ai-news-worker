# 🚀 AI News Worker 部署指南

本指南將幫助您將 AI News Worker 專案部署到生產環境。

## 📋 專案架構

- **前端 (Frontend)**: React + Vite，部署到 Vercel/Netlify
- **後端 (Backend)**: Python 定時任務，部署到 Railway/Render/Docker

## 🔧 前置準備

### 1. Firebase 設定

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案或使用現有專案
3. 啟用 **Firestore Database**
4. 取得兩組憑證：
   - **服務帳號金鑰** (用於後端): 前往 Project Settings > Service Accounts > Generate New Private Key
   - **Web 應用程式配置** (用於前端): 前往 Project Settings > General > Your apps > Web app

### 2. OpenAI API Key

1. 前往 [OpenAI Platform](https://platform.openai.com/)
2. 建立 API Key
3. 記錄此 Key 供後端使用

---

## 🌐 前端部署

### 選項 A: Vercel 部署 (推薦)

1. **安裝 Vercel CLI** (可選)
   ```bash
   npm i -g vercel
   ```

2. **設定環境變數**
   - 前往 Vercel Dashboard > Your Project > Settings > Environment Variables
   - 新增以下變數：
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

3. **部署**
   ```bash
   cd frontend
   vercel
   ```
   或透過 GitHub 連接自動部署

### 選項 B: Netlify 部署

1. **設定環境變數**
   - 前往 Netlify Dashboard > Site Settings > Environment Variables
   - 新增相同的 VITE_* 變數

2. **部署**
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod
   ```
   或透過 GitHub 連接自動部署

### 選項 C: 手動部署到其他平台

1. **建置專案**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **上傳 dist/ 資料夾**到您的靜態網站主機

---

## ⚙️ 後端部署

### 選項 A: Railway 部署 (推薦)

1. **建立 Railway 專案**
   - 前往 [Railway](https://railway.app/)
   - 建立新專案並連接 GitHub

2. **設定環境變數**
   - 在 Railway Dashboard > Variables 中新增：
     ```
     OPENAI_API_KEY=your_openai_api_key
     ```

3. **上傳服務帳號金鑰**
   - 在 Railway Dashboard > Settings > Secrets
   - 建立 Secret: `SERVICE_ACCOUNT_KEY`，內容為 `serviceAccountKey.json` 的完整內容

4. **修改 scheduler.py** (如果需要)
   - 確保能從環境變數讀取服務帳號金鑰
   - Railway 會自動偵測 Dockerfile 並部署

### 選項 B: Render 部署

1. **建立 Render Web Service**
   - 前往 [Render](https://render.com/)
   - 建立新的 Web Service
   - 連接 GitHub repository

2. **設定環境變數**
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **設定 Build & Start Commands**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python scheduler.py`

4. **上傳 serviceAccountKey.json**
   - 在 Render Dashboard > Environment > Secret Files
   - 上傳 `serviceAccountKey.json`

### 選項 C: Docker 部署

1. **建置 Docker 映像**
   ```bash
   cd backend
   docker build -t ai-news-worker .
   ```

2. **運行容器**
   ```bash
   docker run -d \
     -e OPENAI_API_KEY=your_openai_api_key \
     -v $(pwd)/serviceAccountKey.json:/app/serviceAccountKey.json \
     --name ai-news-worker \
     ai-news-worker
   ```

3. **設定定時任務**
   - 使用 cron 或系統排程器定期執行容器
   - 或使用 Docker Compose 配合 cron 容器

### 選項 D: 本地部署 (開發/測試)

1. **安裝依賴**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **設定環境變數**
   ```bash
   # 建立 .env 檔案
   echo "OPENAI_API_KEY=your_openai_api_key" > .env
   ```

3. **確認 serviceAccountKey.json 存在**
   ```bash
   # 確保檔案在 backend/ 目錄下
   ls serviceAccountKey.json
   ```

4. **執行排程器**
   ```bash
   python scheduler.py
   ```

5. **設定系統排程** (Linux/Mac)
   ```bash
   # 編輯 crontab
   crontab -e
   
   # 新增每日執行 (例如每天 09:00)
   0 9 * * * cd /path/to/backend && /path/to/venv/bin/python scheduler.py
   ```

---

## 🔐 安全注意事項

1. **永遠不要將以下檔案提交到 Git**:
   - `serviceAccountKey.json`
   - `.env`
   - 任何包含 API Key 的檔案

2. **使用 .gitignore**
   ```gitignore
   # 後端
   backend/.env
   backend/serviceAccountKey.json
   backend/venv/
   backend/__pycache__/

   # 前端
   frontend/.env
   frontend/.env.local
   frontend/dist/
   frontend/node_modules/
   ```

3. **環境變數管理**
   - 使用平台提供的環境變數功能
   - 不要將敏感資訊寫死在程式碼中

---

## ✅ 部署檢查清單

### 前端
- [ ] Firebase Web 配置已設定
- [ ] 環境變數已正確配置
- [ ] 建置成功 (`npm run build`)
- [ ] 網站可正常訪問
- [ ] Firestore 連線正常

### 後端
- [ ] OpenAI API Key 已設定
- [ ] Firebase 服務帳號金鑰已上傳
- [ ] 定時任務已設定
- [ ] 測試執行成功 (`python scheduler.py`)
- [ ] 日誌可正常查看

---

## 🐛 常見問題

### 前端無法連線 Firebase
- 檢查 Firebase Web 配置是否正確
- 確認 Firestore 規則允許讀取
- 檢查瀏覽器 Console 錯誤訊息

### 後端無法寫入 Firestore
- 確認服務帳號金鑰路徑正確
- 檢查 Firestore 規則是否允許寫入
- 確認服務帳號有適當權限

### 定時任務未執行
- 檢查平台排程設定
- 查看應用程式日誌
- 確認環境變數已正確設定

---

## 📞 支援

如有問題，請檢查：
1. 應用程式日誌
2. Firebase Console 的 Firestore 資料
3. 平台部署日誌

祝部署順利！🎉

