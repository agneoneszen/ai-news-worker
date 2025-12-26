# 🚀 Railway 使用 Metal Build Environment

## 📋 從圖片看到

- ✅ Root Directory: `backend` (已正確設定)
- ⚠️ Nixpacks: 顯示為 "Deprecated"（已棄用）
- ✅ Metal Build Environment: 可用

## ✅ 解決方案：使用 Metal Build Environment

### 步驟 1: 切換 Builder

1. 前往 Railway Dashboard
2. Settings > **Build**
3. **Builder**: 選擇 **Metal Build Environment**
   - 不是 Nixpacks（已棄用）
   - 不是 Dockerfile（如果持續失敗）

### 步驟 2: 確認設定

- **Root Directory**: `backend`（應該已設定）
- **Builder**: `Metal Build Environment`

### 步驟 3: Metal 自動偵測

Metal 會自動：
- 偵測 Python 專案（看到 `requirements.txt`）
- 安裝依賴
- 使用 `Procfile` 或預設命令啟動

### 步驟 4: 確認 Procfile

已建立的 `backend/Procfile`:
```
web: python scheduler_continuous.py
```

Metal 會使用這個啟動命令。

### 步驟 5: 設定環境變數

確保以下變數已設定：
- `OPENAI_API_KEY`
- `SERVICE_ACCOUNT_KEY`

### 步驟 6: 重新部署

1. Deployments > Redeploy
2. 查看 Build Logs

**預期應該看到**:
```
Detected Python project
Installing dependencies...
Starting application...
```

---

## 🔍 為什麼 Metal 更好？

1. **Railway 原生支援**: 最新的建置環境
2. **自動偵測**: 自動識別 Python 專案
3. **更快**: 比 Nixpacks 更快
4. **更可靠**: 持續更新和維護

---

## 📋 檢查清單

- [ ] Builder: Metal Build Environment
- [ ] Root Directory: `backend`
- [ ] Procfile 存在: `backend/Procfile`
- [ ] requirements.txt 存在: `backend/requirements.txt`
- [ ] 環境變數已設定

---

## 🎯 完成後

如果設定正確，Railway 應該會：
1. 自動偵測 Python 專案
2. 安裝依賴
3. 使用 Procfile 啟動服務
4. 排程器正常運行

