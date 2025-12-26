FROM python:3.9-slim

WORKDIR /app

# 安裝系統依賴
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 複製依賴文件
COPY requirements.txt .

# 安裝 Python 依賴
RUN pip install --no-cache-dir -r requirements.txt

# 複製應用程式碼
COPY . .

# 設置環境變數
ENV PYTHONUNBUFFERED=1

# 運行長期排程器（適用於 Railway/Render）
# 如需一次性執行，請使用: CMD ["python", "scheduler.py"]
CMD ["python", "scheduler_continuous.py"]

