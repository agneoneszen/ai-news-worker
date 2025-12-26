# 🚀 快速部署指南

## 前置準備

### 1. 取得必要的 API Keys

#### Firebase 設定
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立專案或選擇現有專案
3. 啟用 **Firestore Database**
4. 取得兩組憑證：
   - **服務帳號金鑰** (後端用): Project Settings > Service Accounts > Generate New Private Key
     - 下載後放到 `backend/serviceAccountKey.json`
   - **Web 配置** (前端用): Project Settings > General > Your apps > Web app
     - 記錄下所有配置值

#### OpenAI API Key
1. 前往 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 建立新的 API Key
3. 記錄此 Key

---

## 🌐 前端部署（推薦 Vercel）

### 方法 1: 使用 Vercel CLI

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 進入前端目錄
cd frontend

# 部署
vercel
```

### 方法 2: 透過 Vercel Dashboard

1. 前往 [Vercel](https://vercel.com/) 並登入
2. 點擊 "Add New Project"
3. 連接您的 GitHub repository
4. 選擇 `frontend` 作為根目錄
5. 在 Environment Variables 中新增：
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
6. 點擊 Deploy

### 方法 3: 使用部署腳本

```bash
./deploy.sh
# 選擇選項 1
```

---

## ⚙️ 後端部署（推薦 Railway）

### 方法 1: Railway 部署

1. **建立 Railway 專案**
   - 前往 [Railway](https://railway.app/)
   - 點擊 "New Project" > "Deploy from GitHub repo"
   - 選擇您的 repository

2. **設定環境變數**
   - 在 Railway Dashboard > Variables 中新增：
     ```
     OPENAI_API_KEY=your_openai_api_key
     ```

3. **上傳服務帳號金鑰**
   - 在 Railway Dashboard > Settings > Secrets
   - 建立新的 Secret，名稱: `SERVICE_ACCOUNT_KEY`
   - 內容: 貼上 `serviceAccountKey.json` 的完整內容

4. **設定服務**
   - Railway 會自動偵測 `backend/Dockerfile`
   - 確認 Root Directory 設為 `backend`
   - 確認 Start Command 為 `python scheduler.py`

5. **設定定時任務**
   - Railway 不支援 cron，建議使用外部 cron 服務（如 cron-job.org）
   - 或使用 Railway 的 Cron Jobs（付費功能）

### 方法 2: Render 部署

1. **建立 Render Web Service**
   - 前往 [Render](https://render.com/)
   - 點擊 "New" > "Web Service"
   - 連接 GitHub repository

2. **設定服務**
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python scheduler.py`

3. **設定環境變數**
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **上傳服務帳號金鑰**
   - 在 Environment > Secret Files
   - 上傳 `serviceAccountKey.json`

### 方法 3: 使用部署腳本

```bash
./deploy.sh
# 選擇選項 3 或 4
```

---

## 🔄 設定定時任務

後端需要每日執行一次。如果使用 Railway 或 Render，您需要：

### 選項 1: 使用外部 Cron 服務（免費）

1. 前往 [cron-job.org](https://cron-job.org/) 或類似服務
2. 建立新的 cron job
3. 設定 URL 為您的後端服務健康檢查端點
4. 設定執行時間（例如每天 09:00 UTC）

### 選項 2: 修改 scheduler.py 為長期運行的服務

可以修改 `scheduler.py` 使其成為長期運行的服務，使用 `schedule` 庫：

```python
import schedule
import time

def job():
    job_pipeline()

# 每天 09:00 執行
schedule.every().day.at("09:00").do(job)

while True:
    schedule.run_pending()
    time.sleep(60)
```

---

## ✅ 部署檢查清單

### 前端
- [ ] Firebase Web 配置已設定
- [ ] 所有環境變數已設定
- [ ] 建置成功 (`npm run build`)
- [ ] 網站可正常訪問
- [ ] Firestore 連線正常

### 後端
- [ ] OpenAI API Key 已設定
- [ ] Firebase 服務帳號金鑰已上傳
- [ ] 定時任務已設定
- [ ] 測試執行成功
- [ ] 日誌可正常查看

---

## 🧪 本地測試

### 測試前端

```bash
cd frontend
npm install
npm run dev
```

訪問 http://localhost:5173

### 測試後端

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python check_setup.py  # 檢查配置
python scheduler.py    # 執行一次任務
```

---

## 🐛 常見問題

### 前端無法連線 Firebase
- 檢查環境變數是否正確設定
- 確認 Firestore 規則允許讀取
- 檢查瀏覽器 Console 錯誤

### 後端無法寫入 Firestore
- 確認服務帳號金鑰路徑正確
- 檢查 Firestore 規則是否允許寫入
- 確認服務帳號有適當權限

### 定時任務未執行
- 檢查平台排程設定
- 查看應用程式日誌
- 確認環境變數已正確設定

---

## 📞 需要幫助？

1. 檢查應用程式日誌
2. 查看 Firebase Console 的 Firestore 資料
3. 檢查平台部署日誌
4. 參考 [DEPLOYMENT.md](./DEPLOYMENT.md) 獲取更詳細的說明

祝部署順利！🎉

