# 🔧 Vercel Root Directory 設定詳細步驟

## 方法 1: 在專案設定中設定（推薦）

### 步驟：

1. **前往專案頁面**
   - 訪問：https://vercel.com/agneoneszens-projects/ai-news-worker
   - 或從 Dashboard 點擊專案名稱

2. **進入 Settings**
   - 點擊頂部導航欄的 **Settings** 標籤

3. **找到 General 設定**
   - 在左側選單中，點擊 **General**
   - 向下滾動找到 **Root Directory** 區塊

4. **如果看不到 Root Directory**
   - 可能需要先進行一次部署
   - 或者嘗試以下方法

## 方法 2: 在部署時設定

### 步驟：

1. **前往 Deployments**
   - 點擊 **Deployments** 標籤
   - 找到最新的部署（或點擊 "Redeploy"）

2. **在部署設定中**
   - 點擊 **Settings**（在部署頁面）
   - 或點擊專案的 **Settings** > **General**
   - 尋找 **Root Directory** 或 **Project Settings**

## 方法 3: 使用 vercel.json（已設定）

好消息！我們已經在 `frontend/vercel.json` 中設定了配置，但 Vercel 可能還需要知道 Root Directory。

### 檢查 vercel.json

我們的 `frontend/vercel.json` 已經包含：
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## 方法 4: 重新匯入專案並設定

如果以上方法都不行，可以重新匯入：

1. **刪除現有專案**（可選，或直接修改）
2. **重新匯入**
   - 前往 https://vercel.com/new
   - 選擇 `agneoneszen/ai-news-worker`
   - 在匯入頁面，您應該會看到 **Configure Project** 選項
   - 在 **Root Directory** 欄位輸入：`frontend`
   - 然後繼續設定環境變數

## 方法 5: 使用 Vercel CLI 設定

如果網頁介面找不到，可以使用 CLI：

```bash
cd frontend
npx vercel --prod
```

在 CLI 互動中可能會詢問 Root Directory。

## 🔍 如何確認 Root Directory 是否正確

### 檢查方式：

1. **查看部署日誌**
   - 前往 **Deployments** > 點擊最新部署
   - 查看 **Build Logs**
   - 如果看到在根目錄執行 `npm install`，表示 Root Directory 可能不正確
   - 應該要在 `frontend` 目錄執行

2. **檢查建置錯誤**
   - 如果建置失敗，錯誤訊息會顯示在哪個目錄執行
   - 例如：`Cannot find package.json` 可能表示在錯誤的目錄

## ✅ 最簡單的解決方案

### 選項 A: 修改專案結構（臨時方案）

如果 Vercel 無法設定 Root Directory，可以：

1. 在專案根目錄建立 `vercel.json`：
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install"
}
```

### 選項 B: 使用 Vercel CLI 重新部署

```bash
cd /Users/yveschen/Desktop/ai-news-worker/frontend
npx vercel --prod
```

在 CLI 中可能會詢問設定。

## 📝 建議操作順序

1. **先嘗試方法 4**（重新匯入並在匯入時設定）
2. **如果不行，使用方法 5**（CLI）
3. **最後選項 A**（修改專案結構）

## 🆘 如果還是不行

請告訴我：
1. 您在 Vercel Dashboard 的哪個頁面？
2. 是否看到 "Settings" > "General"？
3. 部署時是否有錯誤訊息？
4. 我可以幫您建立一個根目錄的 `vercel.json` 來解決這個問題

