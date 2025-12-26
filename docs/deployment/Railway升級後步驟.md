# ✅ Railway 升級後部署步驟

## 🎉 恭喜！Railway 已升級

現在您可以正常部署應用程式了。讓我們完成最後的設定和驗證。

---

## 📋 步驟 1: 確認環境變數設定

### 1.1 檢查 Variables

1. **前往 Railway Dashboard**
   - 點擊您的服務 `ai-news-worker`
   - 點擊 **Variables** 標籤

2. **確認以下變數已設定**：
   ```
   ✅ OPENAI_API_KEY = sk-... (或 [Hidden])
   ✅ SERVICE_ACCOUNT_KEY = [Hidden]
   ```

3. **如果缺少任何變數**：
   - 點擊 **New Variable**
   - 新增缺少的變數

---

## 🚀 步驟 2: 觸發部署

### 2.1 檢查部署狀態

1. **前往 Deployments 標籤**
   - 查看是否有部署記錄
   - 確認部署狀態

### 2.2 觸發新部署

如果沒有部署或需要重新部署：

**方法 1: 透過 Git 推送觸發**
```bash
# 在本地執行（如果需要）
cd /Users/yveschen/Desktop/ai-news-worker
git commit --allow-empty -m "Trigger Railway deployment"
git push
```

**方法 2: 在 Railway Dashboard**
1. 前往 **Deployments** 標籤
2. 點擊 **Redeploy** 或 **Deploy** 按鈕
3. 等待部署完成

**方法 3: 檢查自動部署**
- Railway 通常會自動偵測 GitHub 變更
- 如果已連接 GitHub，推送任何變更都會觸發部署

---

## 🔍 步驟 3: 查看部署日誌

### 3.1 查看 Logs

1. **在服務頁面**
   - 點擊 **Logs** 標籤
   - 或點擊最新部署項目 > **Logs**

### 3.2 預期看到的日誌

**部署成功後，應該會看到：**

```
✅ 從環境變數載入 Firebase 服務帳號金鑰
⏰ AI News Worker 排程器已啟動
============================================================
📅 下次執行時間: 2025-12-27 09:00:00
🔄 檢查間隔: 每 60 秒
============================================================
```

**如果看到錯誤：**

#### ❌ 錯誤 1: "找不到 serviceAccountKey.json"
```
FileNotFoundError: 找不到 serviceAccountKey.json 且未設定 SERVICE_ACCOUNT_KEY 環境變數
```
**解決方法：**
- 確認 `SERVICE_ACCOUNT_KEY` 在 Variables 中已設定
- 確認 JSON 格式完整
- 重新部署

#### ❌ 錯誤 2: "OPENAI_API_KEY 未設定"
```
❌ 未設定 OPENAI_API_KEY
```
**解決方法：**
- 確認在 Variables 中已設定 `OPENAI_API_KEY`
- 確認值正確（以 `sk-` 開頭）

#### ❌ 錯誤 3: "Firestore 連線失敗"
```
❌ Firestore 寫入錯誤: ...
```
**解決方法：**
- 確認 `SERVICE_ACCOUNT_KEY` 內容正確
- 確認服務帳號有 Firestore 寫入權限

---

## 🧪 步驟 4: 立即測試執行（可選）

如果想立即測試後端是否正常，可以修改排程讓它立即執行一次。

### 方法 1: 等待自動執行
- 排程器會在每天 09:00 UTC 自動執行
- 可以等待到執行時間

### 方法 2: 修改為立即執行（測試用）

我可以幫您建立一個測試版本，讓它在啟動時立即執行一次。告訴我是否需要。

---

## 📊 步驟 5: 驗證資料產生

### 5.1 檢查 Firestore

1. **前往 Firebase Console**
   - 訪問：https://console.firebase.google.com/
   - 選擇您的專案：`ai-news-aggregator-8a3af`

2. **查看 Firestore Database**
   - 點擊左側選單的 **Firestore Database**
   - 應該會看到 `daily_news` collection
   - 點擊查看是否有文件（以日期為 ID，例如：`2025-12-26`）

3. **如果沒有資料**
   - 排程器會在每天 09:00 UTC 自動執行
   - 可以等待到執行時間
   - 或使用下方「立即測試」方法

### 5.2 檢查前端

1. **重新整理您的網站**
   - 訪問您的 Vercel 部署 URL
   - 按 F5 或 Cmd+R 重新整理

2. **預期結果**
   - 應該會看到新聞卡片顯示
   - 如果還是顯示 "目前沒有新聞資料"，等待幾分鐘後再重新整理

---

## ✅ 完成檢查清單

- [ ] 所有環境變數已設定（OPENAI_API_KEY, SERVICE_ACCOUNT_KEY）
- [ ] 部署狀態為 "Deployed" 或 "Building"
- [ ] Logs 顯示排程器已啟動
- [ ] 沒有錯誤訊息
- [ ] Firestore 中有資料（或等待執行）
- [ ] 前端可以顯示新聞

---

## 🎯 下一步行動

1. **立即檢查**：前往 Railway Dashboard 查看部署狀態和日誌
2. **等待執行**：排程器會在每天 09:00 UTC 自動執行
3. **立即測試**：告訴我是否需要建立測試版本立即執行

---

## 🆘 需要幫助？

如果遇到問題，請告訴我：
1. Railway Logs 中顯示什麼？
2. 部署狀態是什麼？
3. 是否有任何錯誤訊息？

我可以協助您解決！

