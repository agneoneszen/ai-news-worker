# 🔧 Railway 修復步驟（逐步指南）

## 🎯 目標

讓 Railway 使用 Dockerfile 而非 Railpack 成功部署。

---

## 📋 步驟 1: 確認專案連接

1. 前往 [Railway Dashboard](https://railway.app/dashboard)
2. 確認服務 `ai-news-worker` 存在
3. 如果不存在：
   - 點擊 **New Project**
   - 選擇 **Deploy from GitHub repo**
   - 選擇 `ai-news-worker` 專案

---

## 📋 步驟 2: 設定 Root Directory（最重要）

1. 點擊服務 `ai-news-worker`
2. 前往 **Settings** 標籤
3. 找到 **Source** 區塊
4. **Root Directory**: 設為 `backend`

**⚠️ 關鍵**: 這是最重要的設定！如果設錯，Railway 會從專案根目錄開始，找不到 Dockerfile。

**確認方式**: 
- 應該看到：`Root Directory: backend`
- 不應該是：空、`/`、或根目錄

---

## 📋 步驟 3: 強制使用 Dockerfile

1. 在 **Settings** 標籤中
2. 找到 **Build** 區塊
3. 找到 **Builder** 設定
4. **選擇 "Dockerfile"**（**不是** Railpack 或 Nixpacks）

**檢查清單**:
- [ ] Builder = `Dockerfile` ✅
- [ ] 不是 Railpack ❌
- [ ] 不是 Nixpacks ❌

---

## 📋 步驟 4: 設定 Dockerfile Path

1. 在 **Build** 區塊中
2. 找到 **Dockerfile Path** 欄位
3. **設為 `Dockerfile`**（**不是** `/Dockerfile`）

**重要**:
- ✅ 正確：`Dockerfile`（相對路徑）
- ❌ 錯誤：`/Dockerfile`（絕對路徑）
- ❌ 錯誤：`/backend/Dockerfile`

**原因**: 因為 Root Directory 是 `backend`，Railway 會在 `backend/` 目錄中尋找 `Dockerfile`。

---

## 📋 步驟 5: 設定環境變數

1. 前往 **Settings** > **Variables** 標籤
2. 新增以下變數：

### OPENAI_API_KEY
- **Key**: `OPENAI_API_KEY`
- **Value**: `sk-proj-...`（您的實際 API Key，從 `.env` 檔案或 OpenAI Platform 取得）
- **Type**: Secret（自動）

### SERVICE_ACCOUNT_KEY
- **Key**: `SERVICE_ACCOUNT_KEY`
- **Value**: `{完整 JSON 內容}`（從 `backend/serviceAccountKey.json` 複製整個 JSON）
- **Type**: Secret（自動）

**注意**: SERVICE_ACCOUNT_KEY 是完整的 JSON 物件，不是檔案路徑。

**取得方式**:
```bash
cd backend
cat serviceAccountKey.json
```
複製整個 JSON 內容（從 `{` 到 `}`）。

---

## 📋 步驟 6: 確認設定（檢查清單）

### ✅ Source 設定
- [ ] Root Directory: `backend`

### ✅ Build 設定
- [ ] Builder: `Dockerfile`
- [ ] Dockerfile Path: `Dockerfile`（相對路徑）

### ✅ Variables 設定
- [ ] `OPENAI_API_KEY` 已設定
- [ ] `SERVICE_ACCOUNT_KEY` 已設定（完整 JSON）

---

## 📋 步驟 7: 重新部署

### 方法 1: 在 Dashboard 重新部署

1. 前往 **Deployments** 標籤
2. 點擊最新的部署
3. 點擊 **Redeploy** 按鈕

### 方法 2: 推送新的 commit

```bash
cd /Users/yveschen/Desktop/ai-news-worker
git commit --allow-empty -m "Trigger Railway deployment"
git push
```

---

## 📋 步驟 8: 驗證部署

### 檢查 Build Logs

1. 前往 **Deployments** 標籤
2. 點擊最新的部署
3. 查看 **Build Logs**

**✅ 成功應該看到**:
```
Building Docker image...
Step 1/7 : FROM python:3.9-slim
Step 2/7 : WORKDIR /app
Step 3/7 : RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*
...
Successfully built ...
Successfully tagged ...
```

**❌ 失敗會看到**:
```
Railpack 0.15.4
✖ Railpack could not determine how to build the app.
```

### 檢查 Deploy Logs

1. 查看 **Deploy Logs**
2. 應該看到服務啟動

### 檢查運行日誌

1. 前往 **Logs** 標籤
2. 應該看到：
```
⏰ AI News Worker 排程器已啟動
============================================================
等待排程觸發...
```

---

## 🆘 如果還是不行

### 方案 A: 刪除並重新建立服務

1. 在 Railway Dashboard 刪除現有服務
2. 重新建立服務
3. 從 GitHub 連接專案
4. 按照上述步驟重新設定

### 方案 B: 檢查 Dockerfile 位置

確認 Dockerfile 在正確位置：
```bash
cd backend
ls -la Dockerfile
```

應該會看到 Dockerfile 存在。

### 方案 C: 使用 Nixpacks（備用）

如果 Dockerfile 持續有問題：

1. 在 Builder 設定中選擇 **Nixpacks**
2. 已建立的 `nixpacks.toml` 會自動被使用
3. Railway 會根據 `nixpacks.toml` 建置

---

## 📸 需要協助？

如果還是有問題，請提供：
1. **Settings 截圖**（特別是 Source 和 Build 區塊）
2. **Build Logs** 的完整內容
3. **當前設定值**：
   - Root Directory: `?`
   - Builder: `?`
   - Dockerfile Path: `?`

我可以根據實際設定提供更具體的解決方案。

---

## 🎯 快速檢查指令

在本地驗證 Dockerfile：
```bash
cd backend
docker build -t ai-news-worker-test .
```

如果本地可以建置，Railway 也應該可以。

