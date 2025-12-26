# ✅ Vercel 部署驗證指南

## 🎯 檢查 Vercel 部署狀態

### 步驟 1: 確認部署成功

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊專案 `ai-news-worker`
3. 前往 **Deployments** 標籤
4. 確認最新部署狀態為 **"Ready"**（綠色）

### 步驟 2: 檢查 Build Logs

1. 點擊最新的部署
2. 查看 **Build Logs**

**預期應該看到**:
```
> npm run build
...
✓ built in Xs
```

**如果有錯誤**:
- 檢查錯誤訊息
- 確認環境變數已設定
- 確認 `package.json` 正確

### 步驟 3: 檢查網站

1. 點擊部署查看 **Preview URL**
2. 在瀏覽器中打開 URL
3. 確認網站可以訪問

---

## 🔍 檢查前端顯示問題

### 步驟 1: 打開開發者工具

1. 打開網站
2. 按 `F12` 打開開發者工具
3. 前往 **Console** 標籤

### 步驟 2: 查看 Console 輸出

**預期應該看到**:
```
🔧 [Firebase] 配置檢查:
  - API Key: 已設定
  - Project ID: ai-news-aggregator-8a3af
  - Auth Domain: ...
✅ [Firebase] Firestore 連接成功
🔍 [useNewsData] 開始讀取 Firestore...
📊 [useNewsData] 收到快照，文件數: 1
✅ [useNewsData] 成功載入 1 筆資料
```

**如果有錯誤**:
- `API Key: ❌ 未設定` → 檢查 Vercel 環境變數
- `Firestore 連接失敗` → 檢查 Firebase 配置
- `Missing or insufficient permissions` → 檢查 Firestore 規則

### 步驟 3: 檢查 Network 請求

1. F12 > **Network** 標籤
2. 重新整理頁面
3. 查看 Firebase 相關請求

**預期應該看到**:
- Firebase 相關請求
- 狀態碼 200（成功）

---

## 🔧 常見問題修復

### 問題 1: Console 顯示 "API Key: ❌ 未設定"

**原因**: Vercel 環境變數未設定

**解決**:
1. Vercel Dashboard > Settings > Environment Variables
2. 新增所有 `VITE_` 開頭的變數
3. 重新部署

### 問題 2: "Missing or insufficient permissions"

**原因**: Firestore 規則不允許讀取

**解決**:
1. Firebase Console > Firestore Database > Rules
2. 更新規則：
```javascript
match /daily_news/{document=**} {
  allow read: if true;
}
```

### 問題 3: "資料庫是空的"

**原因**: Firestore 沒有資料

**解決**:
1. 確認 Railway 後端已執行
2. 檢查 Firestore 是否有 `daily_news` collection
3. 確認文件包含 `content` 欄位

---

## 📋 完整檢查清單

### Vercel 部署
- [ ] 部署狀態: Ready
- [ ] Build Logs 沒有錯誤
- [ ] 網站可以訪問

### 環境變數
- [ ] `VITE_FIREBASE_API_KEY` 已設定
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` 已設定
- [ ] `VITE_FIREBASE_PROJECT_ID` 已設定
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` 已設定
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` 已設定
- [ ] `VITE_FIREBASE_APP_ID` 已設定

### Firestore
- [ ] 規則允許讀取
- [ ] `daily_news` collection 有文件
- [ ] 文件包含 `content` 欄位

### 前端 Console
- [ ] 沒有錯誤訊息
- [ ] Firebase 連接成功
- [ ] 成功載入資料

---

## 🎯 預期結果

### 成功標誌

1. **網站可以訪問** ✅
2. **Console 沒有錯誤** ✅
3. **顯示最新日報** ✅
4. **內容格式正確** ✅

---

## 🆘 如果還是有問題

請提供：
1. **Console 完整輸出**（F12 > Console）
2. **Network 請求狀態**（F12 > Network）
3. **Vercel Build Logs**（如果有錯誤）
4. **Firestore 資料截圖**（Firebase Console）

我可以根據實際情況提供更具體的解決方案。

