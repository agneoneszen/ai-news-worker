# ✅ 完成 Vercel 部署設定

## 📍 您的 Vercel 專案
專案 URL: https://vercel.com/agneoneszens-projects/ai-news-worker

## 🔧 需要完成的設定

### 1. 設定 Root Directory

1. 在 Vercel Dashboard 中，點擊專案名稱 `ai-news-worker`
2. 前往 **Settings** > **General**
3. 找到 **Root Directory**
4. 點擊 **Edit**
5. 輸入: `frontend`
6. 點擊 **Save**

### 2. 設定環境變數（重要！）

1. 在專案頁面，點擊 **Settings** > **Environment Variables**
2. 新增以下 6 個環境變數：

   **變數 1:**
   - Name: `VITE_FIREBASE_API_KEY`
   - Value: 你的 Firebase API Key
   - Environment: 勾選 Production, Preview, Development

   **變數 2:**
   - Name: `VITE_FIREBASE_AUTH_DOMAIN`
   - Value: 你的專案.firebaseapp.com
   - Environment: 勾選 Production, Preview, Development

   **變數 3:**
   - Name: `VITE_FIREBASE_PROJECT_ID`
   - Value: 你的專案 ID
   - Environment: 勾選 Production, Preview, Development

   **變數 4:**
   - Name: `VITE_FIREBASE_STORAGE_BUCKET`
   - Value: 你的專案.appspot.com
   - Environment: 勾選 Production, Preview, Development

   **變數 5:**
   - Name: `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - Value: 你的 Messaging Sender ID
   - Environment: 勾選 Production, Preview, Development

   **變數 6:**
   - Name: `VITE_FIREBASE_APP_ID`
   - Value: 你的 App ID
   - Environment: 勾選 Production, Preview, Development

3. 每個變數新增後點擊 **Save**

### 3. 重新部署

設定完環境變數後：

1. 前往 **Deployments** 標籤
2. 找到最新的部署
3. 點擊右側的 **⋯** (三個點)
4. 選擇 **Redeploy**
5. 確認勾選 **Use existing Build Cache**
6. 點擊 **Redeploy**

或者，您可以：
- 前往 **Settings** > **Git**
- 確認已連接 GitHub repository
- 推送任何變更到 GitHub，Vercel 會自動重新部署

## 🌐 查看部署 URL

部署完成後：

1. 前往 **Deployments** 標籤
2. 找到標記為 **Production** 的部署
3. 點擊部署項目
4. 您會看到部署的 URL，格式類似：
   ```
   https://ai-news-worker-xxx.vercel.app
   ```
   或您設定的自訂網域

## ✅ 驗證部署

1. 訪問部署的 URL
2. 打開瀏覽器開發者工具（F12）> Console
3. 確認沒有 Firebase 連線錯誤
4. 如果看到 "資料庫是空的" 是正常的（後端還沒執行任務）

## 🐛 如果遇到問題

### 建置失敗
- 檢查 Root Directory 是否設為 `frontend`
- 查看 **Deployments** > **Logs** 查看錯誤訊息

### 環境變數未生效
- 確認所有變數都已設定
- 確認每個變數都勾選了 Production 環境
- 重新部署專案

### Firebase 連線錯誤
- 檢查環境變數是否正確
- 確認 Firebase 專案設定正確
- 檢查 Firestore 規則是否允許讀取

