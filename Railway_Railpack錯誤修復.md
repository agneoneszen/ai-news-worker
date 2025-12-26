# 🔧 Railway Railpack 錯誤修復

## ❌ 錯誤分析

從日誌看到：
```
✖ Railpack could not determine how to build the app.
▲ Script start.sh not found
The following languages are supported: Php, Golang
```

**問題原因**：
- Railway 正在使用 **Railpack**（自動偵測工具）
- Railpack 不支援 Python，只支援 Php 和 Golang
- Railway 沒有正確使用 Dockerfile

## ✅ 解決方案

### 方案 1: 在 Railway Dashboard 強制使用 Dockerfile（推薦）

1. **前往 Railway Dashboard**
   - 點擊服務 `ai-news-worker`
   - 點擊 **Settings** 標籤

2. **設定 Build 方式**
   - 找到 **Build** 或 **Deploy** 區塊
   - 找到 **Builder** 或 **Build Method**
   - 選擇 **Dockerfile**（不要選擇 Railpack/Nixpacks）

3. **確認設定**
   - Root Directory: `backend`
   - Dockerfile Path: `Dockerfile`（相對路徑）
   - Start Command: `python scheduler_continuous.py`

4. **重新部署**
   - 前往 **Deployments** 標籤
   - 點擊 **Redeploy**

### 方案 2: 確保 Dockerfile 在正確位置

確認檔案結構：
```
backend/
├── Dockerfile          ✅ 必須存在
├── requirements.txt    ✅ 必須存在
├── scheduler_continuous.py
└── ...
```

### 方案 3: 刪除可能干擾的檔案

如果 Railway 還在嘗試使用 Railpack，可以：

1. **刪除 nixpacks.toml**（如果存在）
2. **確保 railway.json 正確配置**

### 方案 4: 使用 Nixpacks（替代方案）

如果 Dockerfile 無法使用，可以建立 `nixpacks.toml`：

```toml
[phases.setup]
nixPkgs = ["python39", "pip"]

[phases.install]
cmds = ["pip install -r requirements.txt"]

[start]
cmd = "python scheduler_continuous.py"
```

但建議優先使用 Dockerfile。

## 🔍 檢查清單

- [ ] Railway Settings 中 Builder 設為 **Dockerfile**
- [ ] Root Directory 設為 `backend`
- [ ] Dockerfile 存在於 `backend/` 目錄
- [ ] requirements.txt 存在且包含所有依賴
- [ ] 環境變數已設定（OPENAI_API_KEY, SERVICE_ACCOUNT_KEY）
- [ ] 沒有 `start.sh` 或其他可能干擾的檔案

## 📝 正確的 Railway 設定

### Settings > General
- **Root Directory**: `backend`
- **Builder**: `Dockerfile`（不是 Railpack/Nixpacks）

### Settings > Deploy
- **Start Command**: `python scheduler_continuous.py`（可選，Dockerfile 中已設定）

### Variables
- `OPENAI_API_KEY` = sk-...
- `SERVICE_ACCOUNT_KEY` = [完整 JSON]

## 🚀 重新部署步驟

1. **確認所有設定**
2. **前往 Deployments**
3. **點擊 Redeploy** 或推送新的 commit
4. **查看 Build Logs**，應該會看到：
   ```
   Building Docker image...
   Step 1/7 : FROM python:3.9-slim
   ...
   ```

## 🆘 如果還是失敗

請提供：
1. Railway Settings 的截圖（特別是 Builder 設定）
2. Build Logs 的完整內容
3. 確認 Dockerfile 是否在 `backend/` 目錄

我可以進一步協助診斷。

