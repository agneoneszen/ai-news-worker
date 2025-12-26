# 🚨 立即修復 Firebase 專案 ID 不匹配

## ❌ 目前狀態

從 Console 看到：
- **前端 Project ID**: `ai-news-worker` ❌
- **實際資料存在的 Project ID**: `ai-news-aggregator` ✅
- **結果**: 前端連接到錯誤的專案，讀取不到資料

---

## ✅ 立即修復步驟（5 分鐘完成）

### 步驟 1: 獲取正確的 Firebase 配置（2 分鐘）

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. **選擇專案**: `ai-news-aggregator`（有資料的專案）
3. 點擊 ⚙️ **Project Settings**
4. 滾動到 **Your apps** 區塊
5. 如果沒有 Web app：
   - 點擊 **Add app** > 選擇 **Web** (</>)
   - 註冊 app（名稱隨意，例如：`ai-news-frontend`）
6. 複製 Firebase 配置（會顯示類似這樣的代碼）：
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ai-news-aggregator.firebaseapp.com",
  projectId: "ai-news-aggregator",  // ← 這個必須是 ai-news-aggregator
  storageBucket: "ai-news-aggregator.appspot.com",
  messagingSenderId: "228635385516",
  appId: "1:228635385516:web:..."
};
```

### 步驟 2: 更新 Vercel 環境變數（2 分鐘）

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇專案 `ai-news-worker`
3. **Settings** > **Environment Variables**
4. 找到以下變數並**更新**：

#### 🔴 必須更新的變數：

| 變數名稱 | 當前值 | 新值 |
|---------|--------|------|
| `VITE_FIREBASE_PROJECT_ID` | `ai-news-worker` | `ai-news-aggregator` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `ai-news-worker.firebaseapp.com` | `ai-news-aggregator.firebaseapp.com` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `ai-news-worker.appspot.com` 或 `ai-news-worker.firebasestorage.app` | `ai-news-aggregator.appspot.com` |

#### 🟡 確認其他變數（從 Firebase Console 複製）：

- `VITE_FIREBASE_API_KEY`: 從 Firebase Console 複製 `apiKey` 的值
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: 從 Firebase Console 複製 `messagingSenderId` 的值
- `VITE_FIREBASE_APP_ID`: 從 Firebase Console 複製 `appId` 的值

**操作方式**：
- 點擊每個變數右側的 "..." > **Edit**
- 更新值
- 點擊 **Save**

### 步驟 3: 觸發重新部署（1 分鐘）

1. 更新環境變數後，Vercel 會**自動觸發重新部署**
2. 或手動觸發：
   - **Deployments** 標籤
   - 點擊最新部署右側的 "..." > **Redeploy**

### 步驟 4: 驗證修復（等待 1-2 分鐘）

1. 等待部署完成（約 1-2 分鐘）
2. 重新整理網站
3. 打開 Console (F12)
4. **應該看到**：
   ```
   - Project ID: ai-news-aggregator  ← 應該改變了！
   📊 [useNewsData] 收到快照，文件數: 1  ← 應該 > 0
   ✅ [useNewsData] 成功載入 1 筆資料
   ```
5. 網站應該顯示日報內容 ✅

---

## 🔍 如何確認已更新

### 檢查 1: Vercel 環境變數

1. Vercel Dashboard > Settings > Environment Variables
2. 確認 `VITE_FIREBASE_PROJECT_ID` 的值是 `ai-news-aggregator`

### 檢查 2: Console 輸出

重新整理網站後，Console 應該顯示：
```
- Project ID: ai-news-aggregator  ← 不是 ai-news-worker
```

### 檢查 3: 資料載入

Console 應該顯示：
```
📊 [useNewsData] 收到快照，文件數: 1  ← 不是 0
✅ [useNewsData] 成功載入 1 筆資料
```

---

## ⚠️ 如果還是顯示 `ai-news-worker`

可能原因：
1. **環境變數還沒更新** → 檢查 Vercel Dashboard
2. **部署還沒完成** → 等待 1-2 分鐘
3. **瀏覽器快取** → 強制重新整理（Ctrl+Shift+R 或 Cmd+Shift+R）

---

## 📋 完整檢查清單

- [ ] 從 Firebase Console 獲取 `ai-news-aggregator` 專案的所有配置
- [ ] 更新 Vercel `VITE_FIREBASE_PROJECT_ID` 為 `ai-news-aggregator`
- [ ] 更新 `VITE_FIREBASE_AUTH_DOMAIN` 為 `ai-news-aggregator.firebaseapp.com`
- [ ] 更新 `VITE_FIREBASE_STORAGE_BUCKET` 為 `ai-news-aggregator.appspot.com`
- [ ] 確認其他 Firebase 變數也正確
- [ ] 等待部署完成（1-2 分鐘）
- [ ] 重新整理網站
- [ ] Console 顯示 `Project ID: ai-news-aggregator`
- [ ] 網站顯示資料

---

## 🎯 預期結果

修復後應該：
1. ✅ Console 顯示 `Project ID: ai-news-aggregator`
2. ✅ `[useNewsData] 收到快照，文件數: X`（X > 0）
3. ✅ 網站顯示日報內容
4. ✅ 沒有錯誤訊息

---

## 🆘 如果還有問題

請提供：
1. **Vercel 環境變數截圖**（確認 `VITE_FIREBASE_PROJECT_ID` 的值）
2. **Console 輸出**（確認 Project ID 是否已改變）
3. **Firebase Console 截圖**（確認 `ai-news-aggregator` 專案有資料）

我可以根據實際情況提供更具體的解決方案。

