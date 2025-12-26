# 🚨 Railway 緊急修復方案

如果 Dockerfile 方式持續失敗，請使用以下方案。

---

## 🔄 方案 1: 使用 Nixpacks（推薦）

Nixpacks 是 Railway 的自動建置工具，支援 Python，可能比 Dockerfile 更可靠。

### 步驟 1: 切換到 Nixpacks

1. 前往 Railway Dashboard
2. Settings > Build
3. **Builder**: 選擇 `Nixpacks`（不是 Dockerfile）
4. **Root Directory**: 確認是 `backend`

### 步驟 2: 確認 nixpacks.toml 存在

已建立的 `backend/nixpacks.toml` 會自動被使用：
```toml
[phases.setup]
nixPkgs = ["python39", "pip"]

[phases.install]
cmds = ["pip install -r requirements.txt"]

[start]
cmd = "python scheduler_continuous.py"
```

### 步驟 3: 設定環境變數

確保以下變數已設定：
- `OPENAI_API_KEY`
- `SERVICE_ACCOUNT_KEY`

### 步驟 4: 重新部署

---

## 🔄 方案 2: 簡化 Dockerfile

如果 Dockerfile 有問題，使用最簡化版本：

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "scheduler_continuous.py"]
```

---

## 🔄 方案 3: 檢查檔案結構

確認 Railway 看到的檔案結構：

1. 前往 Railway Dashboard
2. 查看 Build Logs
3. 應該看到 Railway 分析的檔案列表

**預期應該看到**:
```
backend/
├── Dockerfile
├── requirements.txt
├── scheduler_continuous.py
└── ...
```

**如果看到**:
```
./
├── backend/
├── frontend/
└── ...
```

表示 Root Directory 設定錯誤。

---

## 🔄 方案 4: 刪除並重新建立服務

如果所有方法都失敗：

1. **備份環境變數**
   - 記錄所有環境變數的值

2. **刪除服務**
   - 在 Railway Dashboard 刪除現有服務

3. **重新建立**
   - New Project > Deploy from GitHub repo
   - 選擇 `ai-news-worker`

4. **立即設定**
   - Root Directory: `backend`
   - Builder: `Nixpacks`（先試這個）
   - 環境變數：重新設定

---

## 🔍 診斷步驟

### 1. 檢查 Build Logs

查看完整的 Build Logs，找出具體錯誤：
- 是找不到 Dockerfile？
- 是建置失敗？
- 還是其他錯誤？

### 2. 檢查檔案是否存在

在 Build Logs 中應該看到 Railway 分析的檔案：
```
The app contents that Railpack analyzed contains:
./backend/
├── Dockerfile
├── requirements.txt
...
```

### 3. 檢查環境變數

確認環境變數已正確設定：
- 變數名稱正確
- 變數值完整（特別是 SERVICE_ACCOUNT_KEY）

---

## 🆘 如果還是不行

請提供以下資訊：

1. **Build Logs 的完整內容**（從開始到結束）
2. **Settings 截圖**（Source 和 Build 區塊）
3. **當前設定值**：
   - Root Directory: `?`
   - Builder: `?`
   - Dockerfile Path: `?`

我可以根據實際錯誤提供更具體的解決方案。

---

## 💡 建議

**優先嘗試 Nixpacks**，因為：
- Railway 原生支援
- 自動偵測 Python
- 配置簡單
- 通常比 Dockerfile 更可靠

