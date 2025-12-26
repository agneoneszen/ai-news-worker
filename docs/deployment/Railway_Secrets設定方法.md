# 🔑 Railway Secrets 設定方法

## 方法 1: 在 Variables 標籤設定（推薦）

在 Railway 中，Secrets 和 Environment Variables 通常在同一個地方管理。

### 步驟：

1. **前往 Variables 標籤**
   - 在服務頁面頂部導航欄
   - 點擊 **Variables** 標籤（不是 Settings）

2. **新增 Secret**
   - 點擊 **New Variable** 或 **+ New**
   - 填寫：
     - **Key**: `SERVICE_ACCOUNT_KEY`
     - **Value**: 貼上完整的 JSON 內容
     - **⚠️ 重要**: Railway 會自動將長字串識別為 Secret
   - 點擊 **Add** 或 **Save**

3. **確認設定**
   - 在 Variables 列表應該會看到：
     ```
     SERVICE_ACCOUNT_KEY = [Hidden] 或 [Secret]
     ```

---

## 方法 2: 使用右側導航連結

1. **查看右側導航**
   - 在 Settings 頁面右側，應該有導航連結
   - 尋找 **"Config"** 或 **"Environment"** 相關的連結

2. **點擊相關連結**
   - 可能會導向 Variables/Secrets 設定頁面

---

## 方法 3: 直接在 Variables 標籤設定（最簡單）

### 步驟：

1. **點擊 Variables 標籤**
   - 在服務頁面頂部，點擊 **Variables**（在 Deployments 旁邊）

2. **新增變數**
   - 點擊 **New Variable** 或 **+ New**
   - 填寫：
     ```
     Key: SERVICE_ACCOUNT_KEY
     Value: [貼上完整的 JSON]
     ```
   - Railway 會自動將長字串視為 Secret 並隱藏顯示

3. **確認**
   - 設定後，Value 會顯示為 `[Hidden]` 或 `[Secret]`

---

## 📋 取得服務帳號金鑰內容

請在本地終端機執行以下命令查看完整內容：

```bash
cat backend/serviceAccountKey.json
```

然後複製完整的 JSON 內容（從 `{` 開始到 `}` 結束）貼到 Railway。

---

## ✅ 設定完成後確認

1. **檢查 Variables 列表**
   - 應該會看到兩個變數：
     ```
     OPENAI_API_KEY = sk-... (或 [Hidden])
     SERVICE_ACCOUNT_KEY = [Hidden] 或 [Secret]
     ```

2. **重新部署**
   - 前往 **Deployments** 標籤
   - 點擊最新部署的 **⋯** > **Redeploy**
   - 或 Railway 可能會自動重新部署

3. **查看日誌**
   - 部署完成後，點擊 **Logs** 標籤
   - 應該會看到：
     ```
     ✅ 從環境變數載入 Firebase 服務帳號金鑰
     ⏰ AI News Worker 排程器已啟動
     ```

---

## 🆘 如果還是找不到

請告訴我：
1. 在 Variables 標籤中看到了什麼？
2. 是否有 "New Variable" 或 "+" 按鈕？
3. 是否已經設定了 `OPENAI_API_KEY`？

我可以提供更詳細的指引！

