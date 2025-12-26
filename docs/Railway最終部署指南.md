# 🚂 Railway 最終部署指南

## ❌ 當前問題

Railway 仍然無法成功部署，可能的原因：
1. Builder 設定不正確
2. Root Directory 設定錯誤
3. Dockerfile Path 設定錯誤
4. 環境變數未設定

---

## ✅ 完整部署步驟

### 步驟 1: 確認 Railway 專案

1. 前往 [Railway Dashboard](https://railway.app/dashboard)
2. 確認服務 `ai-news-worker` 存在
3. 如果不存在，點擊 **New Project** > **Deploy from GitHub repo**
4. 選擇 `ai-news-worker` 專案

### 步驟 2: 設定 Source

1. 點擊服務進入設定
2. 前往 **Settings** > **Source**
3. **Root Directory**: 設為 `backend`

**重要**: 這是最關鍵的設定！

### 步驟 3: 設定 Build

1. 前往 **Settings** > **Build**
2. **Builder**: 選擇 `Dockerfile`（**不是** Railpack 或 Nixpacks）
3. **Dockerfile Path**: 設為 `Dockerfile`（**不是** `/Dockerfile`）

**檢查清單**:
- [ ] Builder = `Dockerfile`
- [ ] Dockerfile Path = `Dockerfile`（相對路徑）
- [ ] 沒有選擇 Railpack

### 步驟 4: 設定環境變數

1. 前往 **Settings** > **Variables**
2. 新增以下變數：

**OPENAI_API_KEY**:
- Key: `OPENAI_API_KEY`
- Value: `sk-proj-...`（您的實際 API Key，從 `.env` 檔案或 OpenAI Platform 取得）

**SERVICE_ACCOUNT_KEY**:
- Key: `SERVICE_ACCOUNT_KEY`
- Value: `{完整 JSON 內容}`（從 `backend/serviceAccountKey.json` 複製）

**注意**: SERVICE_ACCOUNT_KEY 是完整的 JSON 物件，不是檔案路徑。

### 步驟 5: 重新部署

1. 前往 **Deployments** 標籤
2. 點擊 **Redeploy** 或推送新的 commit
3. 查看 **Build Logs**

**預期應該看到**:
```
Building Docker image...
Step 1/7 : FROM python:3.9-slim
Step 2/7 : WORKDIR /app
...
Successfully built ...
```

**不應該看到**:
```
Railpack 0.15.4
✖ Railpack could not determine how to build the app.
```

### 步驟 6: 驗證部署

1. 前往 **Logs** 標籤
2. 應該看到：
```
⏰ AI News Worker 排程器已啟動
============================================================
等待排程觸發...
```

---

## 🔍 詳細設定檢查

### Settings > Source
```
Root Directory: backend
```

### Settings > Build
```
Builder: Dockerfile
Dockerfile Path: Dockerfile
```

### Settings > Variables
```
OPENAI_API_KEY: sk-proj-...
SERVICE_ACCOUNT_KEY: {"type":"service_account",...}
```

### Settings > Deploy (可選)
```
Start Command: python scheduler_continuous.py
```
（或留空，使用 Dockerfile 中的 CMD）

---

## 🆘 如果還是不行

### 方案 A: 刪除並重新建立服務

1. 在 Railway Dashboard 刪除現有服務
2. 重新建立服務
3. 從 GitHub 連接專案
4. 按照上述步驟重新設定

### 方案 B: 使用 Nixpacks

如果 Dockerfile 持續有問題：

1. 在 Builder 設定中選擇 **Nixpacks**
2. 已建立的 `nixpacks.toml` 會自動被使用
3. Railway 會根據 `nixpacks.toml` 建置

### 方案 C: 檢查 Dockerfile

確認 `backend/Dockerfile` 存在且內容正確：

```dockerfile
FROM python:3.9-slim
WORKDIR /app
# ... 其他內容
CMD ["python", "scheduler_continuous.py"]
```

---

## 📋 完整檢查清單

### 專案設定
- [ ] Railway 專案已連接 GitHub
- [ ] 專案名稱正確

### Source 設定
- [ ] Root Directory = `backend`

### Build 設定
- [ ] Builder = `Dockerfile`
- [ ] Dockerfile Path = `Dockerfile`（相對路徑）

### 環境變數
- [ ] `OPENAI_API_KEY` 已設定
- [ ] `SERVICE_ACCOUNT_KEY` 已設定（完整 JSON）

### 部署
- [ ] 最新部署狀態為 "Active"
- [ ] Build Logs 顯示 Docker 建置過程
- [ ] Deploy Logs 顯示服務啟動

### 運行
- [ ] Logs 顯示排程器已啟動
- [ ] 沒有錯誤訊息

---

## 🚀 快速修復指令

如果需要重新觸發部署：

```bash
cd /Users/yveschen/Desktop/ai-news-worker
git commit --allow-empty -m "Trigger Railway deployment"
git push
```

---

## 📸 需要協助？

如果還是有問題，請提供：
1. **Settings 截圖**（特別是 Source 和 Build 區塊）
2. **Build Logs** 的完整內容
3. **當前設定值**：
   - Root Directory
   - Builder
   - Dockerfile Path

我可以根據實際設定提供更具體的解決方案。

