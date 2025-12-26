# ✅ Railway 設定檢查清單

請按照此清單逐步檢查 Railway 設定。

---

## 🔍 檢查項目

### 1. Source 設定

- [ ] 前往 **Settings** > **Source**
- [ ] **Root Directory**: `backend` ✅
  - ❌ 如果是空或 `/`，請改為 `backend`

### 2. Build 設定

- [ ] 前往 **Settings** > **Build**
- [ ] **Builder**: `Dockerfile` ✅
  - ❌ 如果是 Railpack，請改為 Dockerfile
  - ❌ 如果是 Nixpacks，可以保留或改為 Dockerfile
- [ ] **Dockerfile Path**: `Dockerfile` ✅
  - ❌ 如果是 `/Dockerfile`，請改為 `Dockerfile`
  - ❌ 如果是 `/backend/Dockerfile`，請改為 `Dockerfile`

### 3. Variables 設定

- [ ] 前往 **Settings** > **Variables**
- [ ] **OPENAI_API_KEY**: 已設定 ✅
  - 值應該是：`sk-proj-...`
- [ ] **SERVICE_ACCOUNT_KEY**: 已設定 ✅
  - 值應該是完整的 JSON（從 `{` 開始到 `}` 結束）
  - 不是檔案路徑

### 4. Deploy 設定（可選）

- [ ] 前往 **Settings** > **Deploy**
- [ ] **Start Command**: `python scheduler_continuous.py`（或留空）
  - Dockerfile 中已設定 CMD，所以可以留空

---

## 📋 正確設定範例

### Source
```
Root Directory: backend
```

### Build
```
Builder: Dockerfile
Dockerfile Path: Dockerfile
```

### Variables
```
OPENAI_API_KEY: sk-proj-...（您的實際 API Key）
SERVICE_ACCOUNT_KEY: {"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}（完整 JSON）
```

---

## 🚀 完成檢查後

1. **儲存所有設定**
2. **前往 Deployments 標籤**
3. **點擊 Redeploy**
4. **查看 Build Logs**

---

## ✅ 成功標誌

如果設定正確，Build Logs 應該顯示：
```
Building Docker image...
Step 1/7 : FROM python:3.9-slim
...
Successfully built ...
```

**不應該看到**:
```
Railpack 0.15.4
✖ Railpack could not determine how to build the app.
```

