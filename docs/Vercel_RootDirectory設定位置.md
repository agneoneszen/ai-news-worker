# 📍 Vercel Root Directory 設定位置

## 🔍 Root Directory 在哪裡？

在 Vercel Dashboard 中，Root Directory 設定可能在以下位置：

### 位置 1: Build & Development Settings（最常見）

1. 前往 **Settings** 標籤
2. 在左側選單中，點擊 **Build and Deployment**（不是 General）
3. 在 "Build & Development Settings" 區塊中
4. 找到 **Root Directory** 選項
5. 點擊 **Edit**
6. 輸入：`frontend`
7. 儲存

### 位置 2: 專案建立時設定

如果專案已經建立，可能需要：
1. 前往 **Settings** > **General**
2. 查看是否有 "Project Settings" 或 "Configuration" 區塊
3. 或者前往 **Settings** > **Build and Deployment**

### 位置 3: 透過 vercel.json 設定

如果 Dashboard 中找不到，可以在 `frontend/vercel.json` 中設定：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rootDirectory": ".",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

但這不是最佳方案，因為 `rootDirectory` 在 vercel.json 中是相對於專案根目錄的。

---

## ✅ 推薦方案：重新連接專案並指定 Root Directory

### 方案 A: 在 Build & Development Settings 中設定

1. **Settings** > **Build and Deployment**
2. 找到 **Build & Development Settings** 區塊
3. 找到 **Root Directory**（可能在 "Override" 區塊中）
4. 設定為 `frontend`

### 方案 B: 重新連接 GitHub 專案

如果還是找不到，可以：

1. **Settings** > **Git**
2. 點擊 **Disconnect**（斷開連接）
3. 重新連接 GitHub 專案
4. 在連接過程中，應該會詢問 **Root Directory**
5. 輸入：`frontend`

### 方案 C: 使用 Vercel CLI 設定

如果 Dashboard 中找不到，可以使用 CLI：

```bash
# 安裝 Vercel CLI（如果還沒安裝）
npm i -g vercel

# 登入
vercel login

# 在專案根目錄執行
cd /Users/yveschen/Desktop/ai-news-worker
vercel link

# 設定 Root Directory
vercel env pull .env.local
```

但這需要修改專案結構或使用 monorepo 設定。

---

## 🎯 最簡單的解決方案：修改專案結構

如果 Vercel 不支援設定 Root Directory，可以：

### 選項 1: 將 frontend 內容移到根目錄

**不推薦**，因為會破壞專案結構。

### 選項 2: 使用 vercel.json 在根目錄

在專案根目錄建立 `vercel.json`：

```json
{
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ]
}
```

但這需要調整建置流程。

### 選項 3: 使用 Vercel Monorepo 設定

如果專案是 monorepo 結構，Vercel 會自動偵測。但這需要額外設定。

---

## 🔧 立即行動：檢查 Build & Development Settings

1. **前往 Vercel Dashboard**
2. **Settings** > **Build and Deployment**（左側選單）
3. **查看 "Build & Development Settings" 區塊**
4. **尋找 "Root Directory" 或 "Override" 選項**

如果還是找不到，請：
1. 截圖 **Build and Deployment** 頁面
2. 或告訴我你看到了什麼選項

我可以根據實際介面提供更具體的指引。

---

## 📋 替代方案：使用 vercel.json 在根目錄

如果 Dashboard 中真的找不到 Root Directory，可以在專案根目錄建立 `vercel.json`：

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

這樣 Vercel 會：
1. 執行 `cd frontend && npm install`
2. 執行 `cd frontend && npm run build`
3. 從 `frontend/dist` 提供檔案

---

## 🆘 如果還是有問題

請提供：
1. **Build and Deployment 頁面截圖**
2. **或告訴我你看到了哪些選項**

我可以根據實際情況提供更具體的解決方案。

