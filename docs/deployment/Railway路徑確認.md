# 🔍 Railway 路徑確認指南

## 📋 路徑設定檢查

### 當前專案結構

```
ai-news-worker/          # GitHub 專案根目錄
├── backend/            # 後端目錄（這是 Root Directory）
│   ├── Dockerfile     # Docker 配置檔案
│   ├── requirements.txt
│   ├── scheduler_continuous.py
│   └── ...
├── frontend/
├── docs/
└── README.md
```

## ✅ 正確的 Railway 設定

### Settings > Source

**Root Directory**: `backend`

**說明**: 
- Railway 會從 `backend/` 目錄開始建置
- 所有相對路徑都相對於 `backend/` 目錄

### Settings > Build

**Builder**: `Dockerfile`

**Dockerfile Path**: `Dockerfile`（**不是** `/Dockerfile`）

**說明**:
- 因為 Root Directory 是 `backend`
- Railway 會在 `backend/` 目錄中尋找 Dockerfile
- 所以路徑應該是相對的 `Dockerfile`，不是絕對的 `/Dockerfile`

### Settings > Watch Paths（可選）

**設定**: `/backend/**`

**說明**:
- 監控 `backend/` 目錄下的所有變更
- 當 `backend/` 目錄有變更時，觸發重新部署

## ❌ 常見錯誤設定

### 錯誤 1: Root Directory 為空或根目錄

**錯誤設定**:
- Root Directory: （空）或 `/`

**問題**:
- Railway 會從專案根目錄開始
- 找不到 `backend/Dockerfile`
- 會嘗試使用 Railpack 自動偵測

**正確設定**:
- Root Directory: `backend`

### 錯誤 2: Dockerfile Path 使用絕對路徑

**錯誤設定**:
- Dockerfile Path: `/Dockerfile` 或 `/backend/Dockerfile`

**問題**:
- Railway 會在專案根目錄尋找 `/Dockerfile`
- 找不到檔案

**正確設定**:
- Dockerfile Path: `Dockerfile`（相對路徑）

### 錯誤 3: Builder 選擇 Railpack

**錯誤設定**:
- Builder: Railpack 或 Nixpacks

**問題**:
- Railway 會嘗試自動偵測語言
- 可能無法正確識別 Python 專案
- 會尋找 `start.sh` 等檔案

**正確設定**:
- Builder: Dockerfile

## 🔍 路徑驗證

### 在本地驗證路徑

```bash
cd backend
ls -la Dockerfile
```

應該會看到：
```
-rw-r--r-- Dockerfile
```

### 在 Railway 驗證

1. 前往 **Deployments** 標籤
2. 點擊最新的部署
3. 查看 **Build Logs**

**正確的輸出應該包含**:
```
Building Docker image...
Step 1/7 : FROM python:3.9-slim
Step 2/7 : WORKDIR /app
...
```

**錯誤的輸出會包含**:
```
Railpack 0.15.4
✖ Railpack could not determine how to build the app.
```

## 📝 完整設定檢查清單

### ✅ Source 設定
- [ ] Root Directory: `backend`（不是空或 `/`）

### ✅ Build 設定
- [ ] Builder: `Dockerfile`（不是 Railpack 或 Nixpacks）
- [ ] Dockerfile Path: `Dockerfile`（不是 `/Dockerfile`）

### ✅ Deploy 設定（可選）
- [ ] Start Command: `python scheduler_continuous.py`（或留空，使用 Dockerfile 中的 CMD）

### ✅ Variables 設定
- [ ] `OPENAI_API_KEY` 已設定
- [ ] `SERVICE_ACCOUNT_KEY` 已設定（完整 JSON）

### ✅ Watch Paths 設定（可選）
- [ ] `/backend/**`（或留空）

## 🚀 設定完成後

1. **儲存設定**: 確認所有設定已儲存
2. **重新部署**: 前往 Deployments 標籤，點擊 Redeploy
3. **查看日誌**: 確認 Build Logs 顯示 Docker 建置過程
4. **驗證運行**: 查看 Logs 確認服務正常啟動

## 🆘 如果還是有問題

請提供：
1. **Settings 截圖**（特別是 Source 和 Build 區塊）
2. **Build Logs** 的完整內容
3. **確認以下值**:
   - Root Directory 的實際值
   - Dockerfile Path 的實際值
   - Builder 的實際選擇

我可以根據實際設定提供更具體的解決方案。

