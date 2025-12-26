# 🔧 Railway 強制使用 Dockerfile 解決方案

## ❌ 問題

Railway 持續使用 Railpack 而不是 Dockerfile，導致錯誤：
```
⚠ Script start.sh not found
✖ Railpack could not determine how to build the app.
```

## ✅ 解決方案：完全移除 Railpack 自動偵測

### 步驟 1: 刪除 railway.json

已刪除 `backend/railway.json`，讓 Railway 完全使用 Dashboard 設定。

### 步驟 2: 在 Railway Dashboard 手動設定

**重要**: 必須在 Dashboard 手動設定，不要依賴配置檔案。

#### 2.1 設定 Root Directory

1. 前往 Railway Dashboard
2. 點擊服務 `ai-news-worker`
3. 前往 **Settings** 標籤
4. 找到 **Source** 區塊
5. **Root Directory**: 設為 `backend`

#### 2.2 強制使用 Dockerfile

1. 在 **Settings** 標籤中
2. 找到 **Build** 區塊
3. **Builder**: 選擇 `Dockerfile`（**不是** Railpack 或 Nixpacks）
4. **Dockerfile Path**: 設為 `Dockerfile`（相對路徑，不是 `/Dockerfile`）

#### 2.3 設定 Start Command（可選）

1. 在 **Settings** > **Deploy** 區塊
2. **Start Command**: `python scheduler_continuous.py`
   - 或留空（Dockerfile 中已設定 CMD）

### 步驟 3: 確認 Dockerfile 存在

確認 `backend/Dockerfile` 存在且內容正確：

```dockerfile
FROM python:3.9-slim
WORKDIR /app
# ... 其他內容
CMD ["python", "scheduler_continuous.py"]
```

### 步驟 4: 重新部署

1. 前往 **Deployments** 標籤
2. 點擊 **Redeploy** 或推送新的 commit
3. 查看 **Build Logs**

**預期應該看到**:
```
Building Docker image...
Step 1/7 : FROM python:3.9-slim
Step 2/7 : WORKDIR /app
...
```

**不應該看到**:
```
Railpack 0.15.4
✖ Railpack could not determine how to build the app.
```

## 🔍 為什麼會這樣？

Railway 的建置優先順序：
1. 如果找到 `railway.json`，會使用其中的設定
2. 如果沒有 `railway.json`，會檢查是否有 Dockerfile
3. 如果沒有 Dockerfile，會使用 Railpack 自動偵測

**問題**: 即使設定了 Dockerfile，如果 `railway.json` 存在且配置不正確，Railway 可能會忽略 Dockerfile。

**解決**: 刪除 `railway.json`，完全在 Dashboard 手動設定。

## 📋 完整檢查清單

### Settings > Source
- [ ] Root Directory: `backend`

### Settings > Build
- [ ] Builder: `Dockerfile`（**不是** Railpack）
- [ ] Dockerfile Path: `Dockerfile`（**不是** `/Dockerfile`）

### Settings > Deploy（可選）
- [ ] Start Command: `python scheduler_continuous.py`（或留空）

### Settings > Variables
- [ ] `OPENAI_API_KEY` 已設定
- [ ] `SERVICE_ACCOUNT_KEY` 已設定

### 檔案檢查
- [ ] `backend/Dockerfile` 存在
- [ ] `backend/railway.json` 已刪除（或不存在）
- [ ] `backend/requirements.txt` 存在

## 🆘 如果還是不行

### 方案 A: 使用 Nixpacks

如果 Dockerfile 還是有問題，可以改用 Nixpacks：

1. 在 Builder 設定中選擇 **Nixpacks**
2. 已建立的 `nixpacks.toml` 會自動被使用
3. Railway 會根據 `nixpacks.toml` 建置 Python 應用程式

### 方案 B: 檢查檔案結構

確認專案結構正確：
```
backend/
├── Dockerfile          ✅ 必須存在
├── requirements.txt   ✅ 必須存在
├── scheduler_continuous.py
└── ...
```

### 方案 C: 查看完整錯誤日誌

如果還是有問題，請提供：
1. **Build Logs** 的完整內容（從開始到結束）
2. **Settings** 截圖（特別是 Build 區塊）
3. 確認 Root Directory 和 Dockerfile Path 的實際值

## 🚀 完成後

完成上述設定後：
1. 點擊 **Redeploy**
2. 查看 **Build Logs**
3. 確認看到 Docker 建置過程
4. 確認服務成功啟動
5. 查看 **Logs** 確認排程器運行

如果成功，應該會看到：
```
Building Docker image...
...
Successfully built ...
Successfully tagged ...
⏰ AI News Worker 排程器已啟動
```

