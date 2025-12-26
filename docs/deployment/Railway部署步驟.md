# 🚂 Railway 後端部署步驟

## 步驟 1: 建立 Railway 專案

1. 前往 https://railway.app/
2. 點擊 **"Start a New Project"** 或 **"Login"**
3. 選擇 **"Deploy from GitHub repo"**
4. 授權 Railway 存取您的 GitHub
5. 選擇 `agneoneszen/ai-news-worker` repository
6. Railway 會自動開始部署

## 步驟 2: 設定 Root Directory

1. 在 Railway Dashboard，點擊您的服務
2. 點擊 **Settings** 標籤
3. 找到 **Root Directory**
4. 輸入: `backend`
5. 點擊 **Save**

## 步驟 3: 設定環境變數

1. 在服務頁面，點擊 **Variables** 標籤
2. 點擊 **New Variable**
3. 新增：
   - **Key**: `OPENAI_API_KEY`
   - **Value**: 你的 OpenAI API Key
4. 點擊 **Add**

## 步驟 4: 上傳服務帳號金鑰

### 方法 1: 使用 Railway Secrets（推薦）

1. 在服務頁面，點擊 **Settings** 標籤
2. 找到 **Secrets** 區塊
3. 點擊 **New Secret**
4. 填寫：
   - **Name**: `SERVICE_ACCOUNT_KEY`
   - **Value**: 貼上 `backend/serviceAccountKey.json` 的完整 JSON 內容
5. 點擊 **Add Secret**

### 查看服務帳號金鑰內容

在終端機執行：
```bash
cat backend/serviceAccountKey.json
```

複製完整的 JSON 內容（從 `{` 開始到 `}` 結束），貼到 Railway Secrets。

## 步驟 5: 確認部署

1. 前往 **Deployments** 標籤
2. 查看部署狀態，應該會顯示 **"Deployed"**
3. 點擊 **Logs** 標籤
4. 應該會看到：
   ```
   ⏰ AI News Worker 排程器已啟動
   📅 下次執行時間: 2025-12-27 09:00:00
   🔄 檢查間隔: 每 60 秒
   ```

## ✅ 驗證部署

### 檢查服務運行

1. 在 Railway Dashboard 查看 **Logs**
2. 確認沒有錯誤訊息
3. 確認看到排程器啟動訊息

### 檢查 Firestore 資料

1. 前往 Firebase Console > Firestore
2. 等待排程器執行（預設每天 09:00 UTC）
3. 或手動觸發測試（見下方）

## 🧪 手動測試（可選）

如果想立即測試後端：

1. 在 Railway 服務頁面，點擊 **Settings**
2. 找到 **Deploy** 區塊
3. 可以重新部署來觸發執行
4. 或修改 `scheduler_continuous.py` 中的排程為每小時執行（測試用）

## 🐛 故障排除

### 部署失敗
- 檢查 Root Directory 是否設為 `backend`
- 查看 Logs 中的錯誤訊息
- 確認 Dockerfile 存在且正確

### 環境變數問題
- 確認 `OPENAI_API_KEY` 已設定
- 確認 `SERVICE_ACCOUNT_KEY` Secret 格式正確（完整 JSON）

### 服務無法啟動
- 查看 Logs 確認錯誤
- 確認所有依賴都已安裝
- 檢查 Python 版本（需要 3.9+）

### Firestore 連線失敗
- 確認 `SERVICE_ACCOUNT_KEY` Secret 內容正確
- 確認服務帳號有 Firestore 寫入權限
- 檢查 Firebase 專案設定

## 📝 重要提示

- Railway 會自動偵測 `backend/Dockerfile`
- 服務會持續運行，排程器會在每天 09:00 UTC 執行
- 可以隨時查看 Logs 監控服務狀態
- 建議設定監控告警（Railway Pro 功能）

