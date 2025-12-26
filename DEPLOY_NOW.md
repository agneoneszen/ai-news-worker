# 🚀 立即部署步驟

## 選項 1: 前端部署到 Vercel（最簡單）

### 步驟 1: 安裝 Vercel CLI

```bash
npm install -g vercel
```

### 步驟 2: 部署前端

```bash
cd frontend
vercel
```

按照提示：
1. 登入 Vercel 帳號（如果還沒登入）
2. 選擇專案設定
3. **重要**: 在部署前，Vercel 會詢問是否要設定環境變數
   - 選擇 "Yes" 並設定以下變數：
     ```
     VITE_FIREBASE_API_KEY=你的_api_key
     VITE_FIREBASE_AUTH_DOMAIN=你的專案.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=你的專案_id
     VITE_FIREBASE_STORAGE_BUCKET=你的專案.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=你的_sender_id
     VITE_FIREBASE_APP_ID=你的_app_id
     ```

### 步驟 3: 生產環境部署

```bash
vercel --prod
```

完成！前端應該已經上線了。

---

## 選項 2: 透過 Vercel Dashboard（推薦，更簡單）

### 步驟 1: 初始化 Git（如果還沒）

```bash
cd /Users/yveschen/Desktop/ai-news-worker
git init
git add .
git commit -m "Initial commit"
```

### 步驟 2: 推送到 GitHub

1. 在 GitHub 建立新 repository
2. 連接並推送：

```bash
git remote add origin https://github.com/你的用戶名/ai-news-worker.git
git branch -M main
git push -u origin main
```

### 步驟 3: 在 Vercel 部署

1. 前往 https://vercel.com/new
2. 連接 GitHub 帳號
3. 選擇您的 repository
4. **重要設定**:
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
5. 在 Environment Variables 中新增所有 Firebase 變數
6. 點擊 Deploy

---

## 選項 3: 後端部署到 Railway

### 步驟 1: 準備 GitHub Repository

```bash
cd /Users/yveschen/Desktop/ai-news-worker
git init
git add .
git commit -m "Initial commit"
# 推送到 GitHub（參考選項 2 的步驟）
```

### 步驟 2: 在 Railway 部署

1. 前往 https://railway.app/
2. 登入並點擊 "New Project"
3. 選擇 "Deploy from GitHub repo"
4. 選擇您的 repository
5. **設定服務**:
   - Root Directory: `backend`
   - 環境變數: 新增 `OPENAI_API_KEY=你的_key`
6. **上傳服務帳號金鑰**:
   - 前往 Settings > Secrets
   - 建立 Secret，名稱: `SERVICE_ACCOUNT_KEY`
   - 內容: 貼上 `backend/serviceAccountKey.json` 的完整內容

### 步驟 3: 設定定時任務

由於 Railway 免費版不支援 cron，建議：
- 使用 [cron-job.org](https://cron-job.org/) 定期呼叫您的服務
- 或修改 `scheduler.py` 為長期運行的服務（見下方）

---

## 🔄 讓後端長期運行（替代定時任務）

如果您想讓後端持續運行並定時執行，可以修改 `scheduler.py`：

```python
import schedule
import time
from scheduler import job_pipeline

def job():
    job_pipeline()

# 每天 09:00 執行
schedule.every().day.at("09:00").do(job)

# 或每小時執行一次（測試用）
# schedule.every().hour.do(job)

print("⏰ 排程器已啟動，等待執行時間...")
while True:
    schedule.run_pending()
    time.sleep(60)  # 每分鐘檢查一次
```

然後在 `requirements.txt` 新增：
```
schedule==1.2.0
```

這樣後端就會持續運行並定時執行任務。

---

## ✅ 快速檢查清單

部署前請確認：

### 前端
- [ ] 已取得 Firebase Web 配置
- [ ] 已準備好所有環境變數值
- [ ] 前端可以成功建置 (`npm run build`)

### 後端
- [ ] 已取得 OpenAI API Key
- [ ] `serviceAccountKey.json` 已存在於 `backend/` 目錄
- [ ] 後端檢查通過 (`python check_setup.py`)

---

## 🎯 推薦部署流程

1. **先部署前端**（Vercel，約 5 分鐘）
2. **再部署後端**（Railway，約 10 分鐘）
3. **測試連線**（確認前端可以讀取 Firestore 資料）
4. **設定定時任務**（確保後端每日執行）

---

## 💡 需要幫助？

執行以下命令檢查配置：

```bash
# 檢查後端
cd backend
python3 check_setup.py

# 檢查前端建置
cd ../frontend
npm run build
```

或使用部署腳本：

```bash
./deploy.sh
```

