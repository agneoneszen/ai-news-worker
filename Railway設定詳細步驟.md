# 🚂 Railway 後端部署 - 步驟 3 詳細說明

## 📋 步驟 3: 上傳服務帳號金鑰到 Railway

### 3.1 取得服務帳號金鑰內容

服務帳號金鑰檔案位於：`backend/serviceAccountKey.json`

**重要**：您需要複製完整的 JSON 內容（從第一個 `{` 開始到最後一個 `}` 結束）

### 3.2 在 Railway 設定 Secret

1. **進入 Railway Dashboard**
   - 前往您的服務頁面
   - 點擊 **Settings** 標籤

2. **找到 Secrets 區塊**
   - 向下滾動找到 **Secrets** 區塊
   - 點擊 **New Secret** 或 **+ New Secret**

3. **填寫 Secret 資訊**
   - **Name**: `SERVICE_ACCOUNT_KEY`
     - ⚠️ 名稱必須完全正確，包括大小寫
   - **Value**: 貼上完整的 JSON 內容
     - 必須是完整的 JSON 格式
     - 從 `{` 開始到 `}` 結束
     - 不要包含檔案路徑或其他文字

4. **範例格式**
   Secret 的值應該是這樣的格式：
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "...",
     "client_id": "...",
     "auth_uri": "...",
     "token_uri": "...",
     "auth_provider_x509_cert_url": "...",
     "client_x509_cert_url": "..."
   }
   ```

5. **點擊 Add Secret 或 Save**

### 3.3 確認 Secret 已設定

設定完成後，在 Secrets 列表應該會看到：
```
SERVICE_ACCOUNT_KEY = [Hidden]
```

---

## ✅ 步驟 4: 確認所有設定

### 4.1 檢查環境變數

在 **Variables** 標籤應該有：
```
✅ OPENAI_API_KEY = sk-... (已設定)
```

### 4.2 檢查 Secrets

在 **Settings** > **Secrets** 應該有：
```
✅ SERVICE_ACCOUNT_KEY = [Hidden]
```

### 4.3 檢查 Root Directory

在 **Settings** > **General** 確認：
- Root Directory: `backend`（或 Railway 已自動偵測）

---

## 🔍 步驟 5: 查看部署狀態和日誌

### 5.1 查看部署狀態

1. 點擊 **Deployments** 標籤
2. 找到最新的部署
3. 確認狀態為 **"Deployed"** 或 **"Building"**

### 5.2 查看日誌

1. 點擊部署項目
2. 點擊 **Logs** 標籤
3. 查看部署和運行日誌

### 5.3 預期看到的日誌

**部署成功後，應該會看到：**

```
⏰ AI News Worker 排程器已啟動
============================================================
📅 下次執行時間: 2025-12-27 09:00:00
🔄 檢查間隔: 每 60 秒
============================================================
```

**如果看到錯誤，常見問題：**

#### 錯誤 1: "找不到 serviceAccountKey.json"
```
FileNotFoundError: 找不到 serviceAccountKey.json 且未設定 SERVICE_ACCOUNT_KEY 環境變數
```
**解決方法：**
- 確認 `SERVICE_ACCOUNT_KEY` Secret 已正確設定
- 確認 JSON 格式完整且正確
- 確認 Secret 名稱完全正確（大小寫敏感）

#### 錯誤 2: "OPENAI_API_KEY 未設定"
```
❌ 未設定 OPENAI_API_KEY
```
**解決方法：**
- 確認在 Variables 中已設定 `OPENAI_API_KEY`
- 確認值正確（以 `sk-` 開頭）

#### 錯誤 3: "Firestore 連線失敗"
```
❌ Firestore 寫入錯誤: ...
```
**解決方法：**
- 確認 `SERVICE_ACCOUNT_KEY` Secret 內容正確
- 確認服務帳號有 Firestore 寫入權限
- 檢查 Firebase Console 確認專案設定

---

## 🧪 步驟 6: 測試執行（可選）

如果想立即測試後端是否正常，可以暫時修改排程：

### 方法 1: 等待自動執行
- 排程器會在每天 09:00 UTC 自動執行
- 可以等待到執行時間

### 方法 2: 立即執行測試（推薦）

我可以幫您建立一個測試版本，讓它立即執行一次：

1. 修改 `scheduler_continuous.py` 在啟動時立即執行一次
2. 推送到 GitHub
3. Railway 會自動重新部署
4. 執行完成後改回原設定

---

## 📊 步驟 7: 驗證資料產生

### 7.1 檢查 Firestore

1. 前往 Firebase Console: https://console.firebase.google.com/
2. 選擇您的專案
3. 點擊左側選單的 **Firestore Database**
4. 應該會看到 `daily_news` collection
5. 點擊查看是否有文件（以日期為 ID，例如：`2025-12-26`）

### 7.2 檢查前端

1. 重新整理您的網站
2. 應該會看到新聞卡片顯示
3. 如果還是空的，等待幾分鐘後再重新整理

---

## 🎯 完成檢查清單

- [ ] 已在 Railway 建立專案並連接 GitHub
- [ ] Root Directory 設為 `backend`（或已自動偵測）
- [ ] 已設定 `OPENAI_API_KEY` 環境變數
- [ ] 已上傳 `SERVICE_ACCOUNT_KEY` Secret（步驟 3）
- [ ] 部署狀態為 "Deployed"
- [ ] Logs 顯示排程器已啟動
- [ ] Firestore 中有資料（等待執行後）
- [ ] 前端可以顯示新聞

---

## 🆘 需要幫助？

如果遇到問題，請告訴我：
1. Railway Logs 中顯示什麼錯誤？
2. `SERVICE_ACCOUNT_KEY` Secret 是否已設定？
3. 部署狀態是什麼？

我可以協助您解決！

