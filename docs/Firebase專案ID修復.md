# 🔧 Firebase 專案 ID 修復指南

## ❌ 問題確認

- **前端配置的 Project ID**: `ai-news-worker`
- **實際資料存在的 Project ID**: `ai-news-aggregator`
- **結果**: 前端連接到錯誤的專案，讀取不到資料

## ✅ 解決方案

需要更新 Vercel 環境變數，使用正確的 Firebase 專案配置。

---

## 🚀 立即修復步驟

### 步驟 1: 獲取正確的 Firebase 配置

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇專案：**ai-news-aggregator**（有資料的專案）
3. 前往 **Project Settings**（⚙️ 圖示）
4. 滾動到 **Your apps** 區塊
5. 如果沒有 Web app，點擊 **Add app** > **Web** (</>)
6. 複製以下配置值：

#### 需要的配置值：

1. **API Key**: `VITE_FIREBASE_API_KEY`
   - 在 Firebase config 中顯示為 `apiKey`

2. **Auth Domain**: `VITE_FIREBASE_AUTH_DOMAIN`
   - 格式：`{project-id}.firebaseapp.com`
   - 例如：`ai-news-aggregator.firebaseapp.com`

3. **Project ID**: `VITE_FIREBASE_PROJECT_ID`
   - **必須改為**: `ai-news-aggregator`

4. **Storage Bucket**: `VITE_FIREBASE_STORAGE_BUCKET`
   - 格式：`{project-id}.appspot.com`
   - 例如：`ai-news-aggregator.appspot.com`

5. **Messaging Sender ID**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - 在 Firebase config 中顯示為 `messagingSenderId`

6. **App ID**: `VITE_FIREBASE_APP_ID`
   - 在 Firebase config 中顯示為 `appId`

### 步驟 2: 更新 Vercel 環境變數

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇專案 `ai-news-worker`
3. **Settings** > **Environment Variables**
4. 更新以下變數：

#### 必須更新的變數：

- `VITE_FIREBASE_PROJECT_ID`: 改為 `ai-news-aggregator`
- `VITE_FIREBASE_AUTH_DOMAIN`: 改為 `ai-news-aggregator.firebaseapp.com`
- `VITE_FIREBASE_STORAGE_BUCKET`: 改為 `ai-news-aggregator.appspot.com`

#### 其他變數（如果不同也需要更新）：

- `VITE_FIREBASE_API_KEY`: 確認是否正確
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: 確認是否正確
- `VITE_FIREBASE_APP_ID`: 確認是否正確

### 步驟 3: 重新部署

1. Vercel 會自動觸發重新部署
2. 或手動觸發：
   - **Deployments** > 點擊最新部署的 "..." > **Redeploy**

### 步驟 4: 驗證修復

1. 等待部署完成（約 1-2 分鐘）
2. 重新整理網站
3. 打開 Console (F12)
4. 應該看到：
   ```
   - Project ID: ai-news-aggregator
   📊 [useNewsData] 收到快照，文件數: 1
   ✅ [useNewsData] 成功載入 1 筆資料
   ```
5. 網站應該顯示日報內容

---

## 📋 檢查清單

- [ ] 從 Firebase Console 獲取 `ai-news-aggregator` 專案的所有配置
- [ ] 更新 Vercel 環境變數 `VITE_FIREBASE_PROJECT_ID` 為 `ai-news-aggregator`
- [ ] 更新 `VITE_FIREBASE_AUTH_DOMAIN` 為 `ai-news-aggregator.firebaseapp.com`
- [ ] 更新 `VITE_FIREBASE_STORAGE_BUCKET` 為 `ai-news-aggregator.appspot.com`
- [ ] 確認其他 Firebase 變數也正確
- [ ] 重新部署完成
- [ ] 網站顯示資料

---

## 🎯 預期結果

修復後應該：
1. ✅ Console 顯示 `Project ID: ai-news-aggregator`
2. ✅ `[useNewsData] 收到快照，文件數: X`（X > 0）
3. ✅ 網站顯示日報內容
4. ✅ 沒有錯誤訊息

---

## ⚠️ 重要提醒

### 後端也需要確認

請同時確認後端（Railway）使用的 Firebase 專案：

1. Railway Dashboard > Variables
2. 查看 `SERVICE_ACCOUNT_KEY` 中的 `project_id`
3. 應該也是 `ai-news-aggregator`

如果後端也是 `ai-news-worker`，需要：
1. 更新 `SERVICE_ACCOUNT_KEY` 為 `ai-news-aggregator` 專案的服務帳號金鑰
2. 或確認後端應該寫入哪個專案

---

## 🆘 如果還有問題

請提供：
1. **Vercel 環境變數截圖**（確認已更新）
2. **Console 輸出**（確認 Project ID）
3. **Firestore 資料截圖**（確認資料存在）

我可以根據實際情況提供更具體的解決方案。

