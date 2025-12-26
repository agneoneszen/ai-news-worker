# 🚀 部署執行步驟

## ✅ 已完成
- [x] Git repository 已初始化
- [x] 所有檔案已準備就緒
- [x] 前端可以成功建置

## 📋 下一步操作

### 步驟 1: 前端部署到 Vercel

#### 選項 A: 使用 Vercel CLI（推薦）

```bash
# 1. 安裝 Vercel CLI（如果還沒安裝）
npm install -g vercel

# 2. 進入前端目錄
cd frontend

# 3. 開始部署
vercel
```

**部署時的重要設定：**
- 當詢問環境變數時，選擇 "Yes" 並設定：
  ```
  VITE_FIREBASE_API_KEY=你的_api_key
  VITE_FIREBASE_AUTH_DOMAIN=你的專案.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=你的專案_id
  VITE_FIREBASE_STORAGE_BUCKET=你的專案.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=你的_sender_id
  VITE_FIREBASE_APP_ID=你的_app_id
  ```

- 完成後執行生產環境部署：
  ```bash
  vercel --prod
  ```

#### 選項 B: 透過 Vercel Dashboard（更簡單）

1. **推送到 GitHub**（如果還沒）：
   ```bash
   # 在 GitHub 建立新 repository，然後：
   git remote add origin https://github.com/你的用戶名/ai-news-worker.git
   git branch -M main
   git push -u origin main
   ```

2. **在 Vercel 部署**：
   - 前往 https://vercel.com/new
   - 連接 GitHub 帳號
   - 選擇您的 repository
   - **重要設定**：
     - Root Directory: `frontend`
     - Framework Preset: `Vite`
   - 在 Environment Variables 中新增所有 Firebase 變數
   - 點擊 Deploy

---

### 步驟 2: 後端部署到 Railway

#### 前置準備
1. 確保已推送到 GitHub（見上方步驟）
2. 準備 OpenAI API Key
3. 確認 `backend/serviceAccountKey.json` 存在

#### 部署步驟

1. **建立 Railway 專案**：
   - 前往 https://railway.app/
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇您的 repository

2. **設定服務**：
   - 在服務設定中：
     - Root Directory: `backend`
     - 確認使用 Dockerfile

3. **設定環境變數**：
   - 在 Railway Dashboard > Variables 中新增：
     ```
     OPENAI_API_KEY=你的_openai_api_key
     ```

4. **上傳服務帳號金鑰**：
   - 方法 1（推薦）：在 Settings > Secrets 中：
     - 建立新的 Secret
     - 名稱: `SERVICE_ACCOUNT_KEY`
     - 內容: 貼上 `backend/serviceAccountKey.json` 的完整 JSON 內容
   
   - 方法 2：修改 scheduler.py 以從環境變數讀取（見下方）

5. **設定定時任務**：
   - Railway 免費版不支援 cron
   - 建議使用外部服務如 [cron-job.org](https://cron-job.org/)
   - 或修改為長期運行的服務（見下方）

---

### 步驟 3: 設定定時任務

#### 選項 A: 使用外部 Cron 服務（免費）

1. 前往 [cron-job.org](https://cron-job.org/)
2. 建立新帳號並建立 cron job
3. 設定 URL 為您的 Railway 服務 URL（需要建立健康檢查端點）
4. 設定執行時間（例如每天 09:00 UTC）

#### 選項 B: 修改為長期運行服務（推薦）

修改 `backend/scheduler.py` 使其持續運行：

```python
import schedule
import time
import os
import datetime
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
from ai_service import analyze_article, generate_daily_briefing
from scraper import get_today_news

load_dotenv()

# 初始化 Firebase
CRED_PATH = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
# 如果從環境變數讀取服務帳號金鑰（Railway Secrets）
if os.getenv("SERVICE_ACCOUNT_KEY"):
    import json
    cred = credentials.Certificate(json.loads(os.getenv("SERVICE_ACCOUNT_KEY")))
else:
    cred = credentials.Certificate(CRED_PATH)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

def job_pipeline():
    today_str = datetime.datetime.now().strftime("%Y-%m-%d")
    print(f"🚀 開始執行每日任務：{today_str}")

    raw_news_list = get_today_news()
    if not raw_news_list:
        print("⚠️ 警告：今日無法抓取到任何新聞")
        return

    processed_articles = []
    print(f"🧠 [2/4] 正在分析 {len(raw_news_list)} 篇新聞...")
    
    for news in raw_news_list:
        analysis_result = analyze_article(news.get("content", ""))
        if analysis_result:
            processed_news = {**news, **analysis_result}
            processed_articles.append(processed_news)
            print(f"  - 已分析: {news['title'][:20]}...")

    if not processed_articles:
        print("❌ 所有新聞分析皆失敗，終止任務。")
        return

    print("📝 [3/4] 正在撰寫每日決策日報...")
    daily_briefing_md = generate_daily_briefing(processed_articles)

    print("💾 [4/4] 正在寫入資料庫...")
    try:
        db.collection('daily_news').document(today_str).set({
            'date_str': today_str,
            'content': daily_briefing_md,
            'article_count': len(processed_articles),
            'tags': list(set([a['category'] for a in processed_articles])),
            'created_at': firestore.SERVER_TIMESTAMP,
            'status': 'published'
        })
        print(f"✅ 任務成功！真實日報已存入: daily_news/{today_str}")
    except Exception as e:
        print(f"❌ Firestore 寫入錯誤: {e}")

# 排程設定
schedule.every().day.at("09:00").do(job_pipeline)

# 也可以立即執行一次（測試用）
# job_pipeline()

print("⏰ 排程器已啟動，等待執行時間...")
print(f"下次執行時間: {schedule.next_run()}")

while True:
    schedule.run_pending()
    time.sleep(60)  # 每分鐘檢查一次
```

並在 `requirements.txt` 新增：
```
schedule==1.2.0
```

---

## 🔍 部署後檢查

### 前端檢查
1. 訪問部署的 URL
2. 檢查瀏覽器 Console 是否有錯誤
3. 確認可以讀取 Firestore 資料

### 後端檢查
1. 查看 Railway 日誌
2. 確認服務正常運行
3. 檢查 Firestore 是否有新資料寫入

---

## 📝 快速命令參考

```bash
# 檢查後端配置
cd backend && python3 check_setup.py

# 測試前端建置
cd frontend && npm run build

# 本地測試後端
cd backend && source venv/bin/activate && python scheduler.py

# 查看 Git 狀態
git status
```

---

## 🆘 需要幫助？

如果遇到問題：
1. 檢查應用程式日誌
2. 確認環境變數已正確設定
3. 查看 Firebase Console 確認連線
4. 參考 `DEPLOYMENT.md` 獲取詳細說明

