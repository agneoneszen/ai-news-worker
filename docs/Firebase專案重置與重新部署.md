# 🔄 Firebase 專案重置與重新部署完整指南

## ⚠️ 重要提醒

**刪除 Firebase 專案是不可逆的操作！**
- 所有資料將永久刪除
- 所有配置將遺失
- 無法復原

**請確認**：
- [ ] 已備份重要資料（如果需要）
- [ ] 已記錄所有配置資訊
- [ ] 已準備好重新設定

---

## 📋 步驟 1: 刪除現有 Firebase 專案

### 1.1 刪除 ai-news-worker 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇專案：**ai-news-worker**
3. 點擊 ⚙️ **Project Settings**（專案設定）
4. 滾動到最底部
5. 找到 **Delete project**（刪除專案）區塊
6. 點擊 **Delete project**
7. 輸入專案名稱確認：`ai-news-worker`
8. 點擊 **Delete** 確認

### 1.2 刪除 ai-news-aggregator 專案

1. 在 Firebase Console 中
2. 選擇專案：**ai-news-aggregator**
3. 點擊 ⚙️ **Project Settings**
4. 滾動到最底部
5. 找到 **Delete project** 區塊
6. 點擊 **Delete project**
7. 輸入專案名稱確認：`ai-news-aggregator`
8. 點擊 **Delete** 確認

**注意**：刪除專案可能需要幾分鐘時間。

---

## 📋 步驟 2: 建立新的 Firebase 專案

### 2.1 建立新專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊 **Add project**（新增專案）或 **建立專案**
3. **專案名稱**：輸入 `ai-news-aggregator`（建議使用這個名稱，避免混淆）
4. **專案 ID**：會自動生成，或可以自訂（例如：`ai-news-aggregator-2025`）
5. 點擊 **Continue**（繼續）

### 2.2 設定 Google Analytics（可選）

1. 選擇是否啟用 Google Analytics
   - **建議**：先選擇 **Not now**（稍後再說），簡化設定
2. 點擊 **Create project**（建立專案）
3. 等待專案建立完成（約 30 秒）

---

## 📋 步驟 3: 設定 Firestore Database

### 3.1 建立 Firestore Database

1. 在 Firebase Console 中，選擇新建立的專案
2. 左側選單 > **Firestore Database**
3. 點擊 **Create database**（建立資料庫）
4. **選擇模式**：
   - 選擇 **Start in production mode**（生產模式）
   - 點擊 **Next**
5. **選擇位置**：
   - 選擇離你最近的區域（例如：`asia-east1` 或 `us-central1`）
   - 點擊 **Enable**（啟用）

### 3.2 設定 Firestore 規則

1. Firestore Database > **Rules** 標籤
2. 更新規則為：
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /daily_news/{document=**} {
      allow read: if true;  // 允許所有人讀取
      allow write: if false; // 只允許服務帳號寫入（透過後端）
    }
  }
}
```
3. 點擊 **Publish**（發布）

---

## 📋 步驟 4: 建立 Web App

### 4.1 註冊 Web App

1. Firebase Console > **Project Overview**
2. 點擊 **</>**（Web 圖示）或 **Add app** > **Web**
3. **App nickname**：輸入 `ai-news-frontend`
4. **Firebase Hosting**：可選，先不勾選
5. 點擊 **Register app**（註冊應用程式）

### 4.2 複製 Firebase 配置

1. 會顯示 Firebase 配置代碼，類似：
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ai-news-aggregator-xxxxx.firebaseapp.com",
  projectId: "ai-news-aggregator-xxxxx",
  storageBucket: "ai-news-aggregator-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

2. **複製這些值**，稍後會用到

---

## 📋 步驟 5: 建立服務帳號（後端使用）

### 5.1 下載服務帳號金鑰

1. Firebase Console > ⚙️ **Project Settings**
2. **Service accounts** 標籤
3. 點擊 **Generate new private key**（產生新的私密金鑰）
4. 確認對話框，點擊 **Generate key**（產生金鑰）
5. 會下載一個 JSON 檔案（例如：`ai-news-aggregator-xxxxx-firebase-adminsdk-xxxxx.json`）

### 5.2 儲存服務帳號金鑰

1. 將下載的 JSON 檔案重新命名為：`serviceAccountKey.json`
2. 移動到 `backend/` 目錄
3. **重要**：確認 `.gitignore` 包含 `serviceAccountKey.json`

---

## 📋 步驟 6: 更新後端配置

### 6.1 更新本地 serviceAccountKey.json

1. 將新的 `serviceAccountKey.json` 放到 `backend/` 目錄
2. 確認檔案內容正確

### 6.2 更新 Railway 環境變數

1. 前往 [Railway Dashboard](https://railway.app/dashboard)
2. 選擇服務
3. **Variables** 標籤
4. 找到 `SERVICE_ACCOUNT_KEY` 變數
5. 點擊 **Edit**（編輯）
6. **更新值**：
   - 打開新的 `serviceAccountKey.json`
   - 複製**整個 JSON 內容**
   - 貼到 Railway 的 `SERVICE_ACCOUNT_KEY` 變數中
   - 點擊 **Save**（儲存）

**重要**：必須是完整的 JSON，包括所有大括號。

---

## 📋 步驟 7: 更新前端配置

### 7.1 更新 Vercel 環境變數

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇專案 `ai-news-worker`
3. **Settings** > **Environment Variables**
4. 更新以下變數（從步驟 4.2 複製的值）：

| 變數名稱 | 值（從 Firebase 配置複製） |
|---------|------------------------|
| `VITE_FIREBASE_API_KEY` | `apiKey` 的值 |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` 的值 |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` 的值 |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` 的值 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` 的值 |
| `VITE_FIREBASE_APP_ID` | `appId` 的值 |

5. 點擊 **Save**（儲存）每個變數

### 7.2 觸發重新部署

1. Vercel 會自動觸發重新部署
2. 或手動觸發：
   - **Deployments** 標籤
   - 點擊最新部署的 "..." > **Redeploy**

---

## 📋 步驟 8: 驗證配置

### 8.1 驗證後端配置

1. 檢查 Railway Logs
2. 應該看到：
   ```
   ✅ 從檔案載入 Firebase 服務帳號金鑰
   ```
   或
   ```
   ✅ 從環境變數載入 Firebase 服務帳號金鑰
   ```

### 8.2 驗證前端配置

1. 等待 Vercel 部署完成
2. 打開網站
3. 按 F12 打開 Console
4. 應該看到：
   ```
   🔧 [Firebase] 配置檢查:
     - Project ID: ai-news-aggregator-xxxxx  ← 新的專案 ID
   ✅ [Firebase] Firestore 已初始化
   ```

### 8.3 測試後端執行

1. 等待 Railway 排程器執行（或手動觸發）
2. 檢查 Railway Logs
3. 應該看到：
   ```
   🚀 開始執行每日任務：2025-12-26
   💾 [5/5] 正在寫入資料庫...
   ✅ 任務成功！真實日報已存入: daily_news/2025-12-26
   ```

### 8.4 驗證資料寫入

1. Firebase Console > Firestore Database
2. 確認 `daily_news` collection 有文件
3. 確認文件包含 `content` 欄位

### 8.5 驗證前端讀取

1. 重新整理網站
2. Console 應該顯示：
   ```
   📊 [useNewsData] 收到快照，文件數: 1
   ✅ [useNewsData] 成功載入 1 筆資料
   ```
3. 網站應該顯示日報內容

---

## 📋 檢查清單

### Firebase 設定
- [ ] 已刪除舊專案 `ai-news-worker`
- [ ] 已刪除舊專案 `ai-news-aggregator`
- [ ] 已建立新專案（建議名稱：`ai-news-aggregator`）
- [ ] 已建立 Firestore Database
- [ ] 已設定 Firestore 規則（允許讀取）
- [ ] 已註冊 Web App
- [ ] 已下載服務帳號金鑰

### 後端配置
- [ ] 已更新本地 `serviceAccountKey.json`
- [ ] 已更新 Railway `SERVICE_ACCOUNT_KEY` 環境變數
- [ ] Railway Logs 顯示 Firebase 連接成功

### 前端配置
- [ ] 已更新 Vercel 所有 Firebase 環境變數
- [ ] Vercel 部署完成
- [ ] Console 顯示正確的 Project ID
- [ ] 網站可以訪問

### 驗證
- [ ] 後端執行成功
- [ ] Firestore 有資料
- [ ] 前端可以讀取資料
- [ ] 網站顯示日報內容

---

## 🆘 常見問題

### Q1: 刪除專案時提示錯誤

**A**: 可能原因：
- 專案中有正在使用的服務
- 需要先刪除所有資源
- 等待幾分鐘後再試

### Q2: 服務帳號金鑰格式錯誤

**A**: 確保：
- 是完整的 JSON（包括所有大括號）
- 沒有多餘的空格或換行
- Railway 變數中正確貼上

### Q3: 前端還是讀取不到資料

**A**: 檢查：
- Vercel 環境變數是否正確
- 是否強制重新整理（Ctrl+Shift+R）
- Console 中的 Project ID 是否正確
- Firestore 規則是否允許讀取

### Q4: 後端寫入失敗

**A**: 檢查：
- Railway `SERVICE_ACCOUNT_KEY` 是否正確
- 服務帳號是否有 Firestore 寫入權限（預設有）
- Railway Logs 中的錯誤訊息

---

## 📝 重要提醒

1. **專案 ID 一致性**：
   - 前端和後端必須使用**相同的** Firebase 專案
   - 確認 Project ID 完全一致

2. **環境變數更新**：
   - 更新後需要重新部署
   - 等待部署完成後再測試

3. **資料備份**：
   - 如果需要保留舊資料，請先匯出
   - Firestore > 設定 > 匯出資料

4. **測試順序**：
   - 先測試後端寫入
   - 再測試前端讀取
   - 最後驗證完整流程

---

## 🎯 完成後

如果所有步驟都完成，應該：
1. ✅ 後端成功寫入 Firestore
2. ✅ 前端成功讀取資料
3. ✅ 網站顯示日報內容
4. ✅ 沒有錯誤訊息

如果還有問題，請提供：
- Firebase Console 截圖（專案設定）
- Railway Logs（後端執行記錄）
- Vercel 環境變數截圖（確認配置）
- Console 輸出（前端錯誤訊息）

我可以根據實際情況提供更具體的解決方案。

