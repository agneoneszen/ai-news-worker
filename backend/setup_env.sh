#!/bin/bash
# 環境變數設定助手

echo "🔧 OpenAI API Key 設定助手"
echo ""

# 檢查 .env 檔案是否存在
if [ -f .env ]; then
    echo "⚠️  .env 檔案已存在"
    echo ""
    echo "當前內容:"
    grep "OPENAI_API_KEY" .env | sed 's/OPENAI_API_KEY=.*/OPENAI_API_KEY=sk-***/' || echo "  (未找到 OPENAI_API_KEY)"
    echo ""
    read -p "是否要覆蓋現有設定？(y/N): " overwrite
    if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
        echo "取消操作"
        exit 0
    fi
fi

echo "請輸入您的 OpenAI API Key:"
echo "  (格式: sk-...)"
echo "  (可在 https://platform.openai.com/api-keys 取得)"
echo ""
read -p "API Key: " api_key

if [ -z "$api_key" ]; then
    echo "❌ API Key 不能為空"
    exit 1
fi

# 驗證格式
if [[ ! "$api_key" =~ ^sk- ]]; then
    echo "⚠️  警告: API Key 格式可能不正確（應該以 sk- 開頭）"
    read -p "是否繼續？(y/N): " continue
    if [ "$continue" != "y" ] && [ "$continue" != "Y" ]; then
        echo "取消操作"
        exit 0
    fi
fi

# 寫入 .env 檔案
echo "OPENAI_API_KEY=$api_key" > .env
echo ""
echo "✅ 已設定 OPENAI_API_KEY"
echo ""
echo "驗證設定..."
python3 -c "import os; from dotenv import load_dotenv; load_dotenv(); key = os.getenv('OPENAI_API_KEY'); print('✅ API Key 已正確載入' if key else '❌ API Key 載入失敗'); print(f'   長度: {len(key) if key else 0} 字元')" 2>/dev/null || echo "⚠️  無法驗證（可能需要先安裝 python-dotenv）"

echo ""
echo "下一步:"
echo "  1. 執行 python3 check_setup.py 確認設定"
echo "  2. 執行 python3 test_ai_only.py 測試 AI 功能"
echo "  3. 執行 ./run_local.sh 進行完整測試"

