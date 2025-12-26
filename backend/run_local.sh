#!/bin/bash
# 本地測試腳本

echo "🧪 啟動本地測試環境"
echo ""

# 檢查 Python 環境
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 未安裝"
    exit 1
fi

# 檢查虛擬環境
if [ ! -d "venv" ]; then
    echo "📦 建立虛擬環境..."
    python3 -m venv venv
fi

# 啟動虛擬環境
echo "🔧 啟動虛擬環境..."
source venv/bin/activate

# 安裝依賴
echo "📥 安裝依賴..."
pip install -q -r requirements.txt

# 檢查環境變數
if [ ! -f ".env" ]; then
    echo "⚠️  警告: .env 檔案不存在"
    echo "請建立 .env 檔案並設定 OPENAI_API_KEY"
    echo ""
fi

# 執行測試
echo "🚀 執行測試流程..."
echo ""
python3 test_local.py

# 顯示快取統計
echo ""
echo "📊 快取統計:"
python3 -c "from cache_manager import get_cache_stats; import json; print(json.dumps(get_cache_stats(), indent=2, ensure_ascii=False))"

