# 📥 如何從 Firebase Console 下載服務帳號金鑰

## 🎯 用途說明

服務帳號金鑰用於：
- **後端應用程式**（Railway）連接 Firebase
- **寫入 Firestore** 資料庫
- **不需要用戶認證**，適合伺服器端使用

---

## 📋 步驟 1: 前往 Firebase Console

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇您的專案（例如：`ai-news-aggregator`）

---

## 📋 步驟 2: 開啟專案設定

1. 點擊左上角的 ⚙️ **Project Settings**（專案設定）
   - 或點擊專案名稱旁邊的齒輪圖示

---

## 📋 步驟 3: 前往 Service Accounts 標籤

1. 在 Project Settings 頁面中
2. 點擊頂部的 **Service accounts** 標籤
3. 您會看到類似這樣的內容：
   ```
   Service accounts
   Firebase Admin SDK
   ```

---

## 📋 步驟 4: 產生新的私密金鑰

1. 在 **Service accounts** 標籤中
2. 找到 **Firebase Admin SDK** 區塊
3. 點擊 **Generate new private key**（產生新的私密金鑰）按鈕
   - 按鈕通常在區塊的右側或底部

---

## 📋 步驟 5: 確認對話框

1. 會彈出一個確認對話框，內容類似：
   ```
   Generate a new private key?
   
   This will create a new private key for the App Engine default service account.
   You can only download the key once. Make sure to store it securely.
   ```
2. 點擊 **Generate key**（產生金鑰）按鈕

---

## 📋 步驟 6: 下載 JSON 檔案

1. 瀏覽器會自動下載一個 JSON 檔案
2. 檔案名稱類似：`ai-news-aggregator-xxxxx-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`
3. 檔案會下載到您的**下載資料夾**（Downloads）

---

## 📋 步驟 7: 重新命名並移動檔案

### 7.1 重新命名檔案

1. 找到下載的 JSON 檔案
2. 重新命名為：`serviceAccountKey.json`
   - 移除所有前綴和後綴
   - 只保留 `serviceAccountKey.json`

### 7.2 移動到專案目錄

1. 將 `serviceAccountKey.json` 移動到：
   ```
   /Users/yveschen/Desktop/ai-news-worker/backend/serviceAccountKey.json
   ```

**操作方式**：
- **Mac**: 拖放檔案到 `backend/` 資料夾
- **Windows**: 複製檔案到 `backend\` 資料夾
- **或使用終端機**：
  ```bash
  cd ~/Downloads
  mv ai-news-aggregator-*-firebase-adminsdk-*.json ~/Desktop/ai-news-worker/backend/serviceAccountKey.json
  ```

---

## 📋 步驟 8: 驗證檔案內容

### 8.1 檢查檔案格式

打開 `serviceAccountKey.json`，應該看到類似這樣的內容：

```json
{
  "type": "service_account",
  "project_id": "ai-news-aggregator-xxxxx",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@ai-news-aggregator-xxxxx.iam.gserviceaccount.com",
  "client_id": "xxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

### 8.2 確認重要欄位

確認以下欄位存在：
- ✅ `project_id`：應該是您的 Firebase 專案 ID
- ✅ `private_key`：應該包含 `-----BEGIN PRIVATE KEY-----`
- ✅ `client_email`：應該包含 `@...iam.gserviceaccount.com`

---

## 📋 步驟 9: 設定 Railway 環境變數（部署用）

### 9.1 複製 JSON 內容

1. 打開 `serviceAccountKey.json`
2. **全選**（Ctrl+A 或 Cmd+A）
3. **複製**（Ctrl+C 或 Cmd+C）
4. **重要**：必須複製**完整的 JSON**，包括所有大括號

### 9.2 貼到 Railway

1. 前往 [Railway Dashboard](https://railway.app/dashboard)
2. 選擇您的服務
3. **Variables** 標籤
4. 找到 `SERVICE_ACCOUNT_KEY` 變數
5. 點擊 **Edit**（編輯）
6. **貼上**完整的 JSON 內容（Ctrl+V 或 Cmd+V）
7. 點擊 **Save**（儲存）

**重要提醒**：
- ✅ 必須是**完整的 JSON**（包括 `{` 和 `}`）
- ✅ 不能有多餘的空格或換行
- ✅ 必須是**單行**或**格式正確的 JSON**

---

## 📋 步驟 10: 驗證設定

### 10.1 本地測試

```bash
cd backend
python check_setup.py
```

應該看到：
```
✅ Firebase 服務帳號金鑰: 已找到
```

### 10.2 Railway 測試

1. 檢查 Railway Logs
2. 應該看到：
   ```
   ✅ 從環境變數載入 Firebase 服務帳號金鑰
   ```
   或
   ```
   ✅ 從檔案載入 Firebase 服務帳號金鑰
   ```

---

## ⚠️ 安全提醒

### 🔒 重要安全事項

1. **不要提交到 Git**：
   - 確認 `.gitignore` 包含 `serviceAccountKey.json`
   - 確認檔案不會被推送到 GitHub

2. **不要分享給他人**：
   - 服務帳號金鑰具有完整的管理權限
   - 洩露可能導致資料被刪除或修改

3. **定期輪換**：
   - 如果懷疑金鑰洩露，立即刪除並產生新的
   - 在 Firebase Console > Service accounts 中刪除舊的金鑰

4. **使用環境變數**：
   - 生產環境（Railway）使用環境變數
   - 本地開發使用檔案（但不要提交）

---

## 🆘 常見問題

### Q1: 找不到 "Generate new private key" 按鈕

**A**: 
- 確認您在 **Service accounts** 標籤中
- 確認您有專案的管理權限
- 嘗試重新整理頁面

### Q2: 下載的檔案名稱很長

**A**: 
- 這是正常的，Firebase 會自動生成長檔名
- 重新命名為 `serviceAccountKey.json` 即可

### Q3: JSON 格式錯誤

**A**: 
- 確認複製了完整的 JSON（包括所有大括號）
- 確認沒有多餘的空格或換行
- 可以使用 JSON 驗證工具檢查

### Q4: Railway 顯示格式錯誤

**A**: 
- 確認貼上的是**完整的 JSON**
- 確認是**單行**或**格式正確的 JSON**
- 確認沒有多餘的空格

### Q5: 本地找不到檔案

**A**: 
- 檢查下載資料夾（Downloads）
- 使用檔案搜尋功能
- 確認檔案副檔名是 `.json`

---

## 📋 檢查清單

- [ ] 已前往 Firebase Console
- [ ] 已選擇正確的專案
- [ ] 已開啟 Project Settings
- [ ] 已前往 Service accounts 標籤
- [ ] 已點擊 Generate new private key
- [ ] 已確認對話框並下載檔案
- [ ] 已重新命名為 `serviceAccountKey.json`
- [ ] 已移動到 `backend/` 目錄
- [ ] 已驗證檔案內容正確
- [ ] 已設定 Railway 環境變數（如果使用）
- [ ] 已確認 `.gitignore` 包含檔案名稱
- [ ] 已測試本地連接（可選）

---

## 🎯 完成後

如果所有步驟都完成，應該：
1. ✅ `backend/serviceAccountKey.json` 檔案存在
2. ✅ Railway `SERVICE_ACCOUNT_KEY` 已設定（如果使用）
3. ✅ 後端可以成功連接 Firebase
4. ✅ 可以寫入 Firestore 資料庫

---

## 📝 下一步

下載服務帳號金鑰後，請：
1. 按照 [Firebase 專案重置與重新部署指南](./Firebase專案重置與重新部署.md) 繼續設定
2. 或按照 [環境變數設定指南](./環境變數設定指南.md) 設定環境變數

如果還有問題，請提供：
- Firebase Console 截圖（Service accounts 頁面）
- 錯誤訊息（如果有）
- Railway Logs（如果使用 Railway）

我可以根據實際情況提供更具體的協助。

