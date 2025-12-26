#!/bin/bash

# AI News Worker 快速部署腳本
# 此腳本協助您快速部署前端和後端

set -e

echo "🚀 AI News Worker 部署助手"
echo "================================"
echo ""

# 顏色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 檢查函數
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 已安裝${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 未安裝${NC}"
        return 1
    fi
}

# 1. 檢查必要工具
echo "📋 步驟 1: 檢查必要工具..."
echo ""

check_command "node" || {
    echo "請先安裝 Node.js: https://nodejs.org/"
    exit 1
}

check_command "npm" || {
    echo "請先安裝 npm"
    exit 1
}

check_command "python3" || {
    echo "請先安裝 Python 3"
    exit 1
}

echo ""
echo "================================"
echo ""

# 2. 選擇部署方式
echo "請選擇部署方式："
echo "1) 前端部署到 Vercel"
echo "2) 前端部署到 Netlify"
echo "3) 後端部署到 Railway"
echo "4) 後端部署到 Render"
echo "5) 本地測試建置"
echo "6) 全部檢查"
read -p "請輸入選項 (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🌐 部署前端到 Vercel..."
        if ! check_command "vercel"; then
            echo "正在安裝 Vercel CLI..."
            npm install -g vercel
        fi
        cd frontend
        echo ""
        echo "⚠️  請確保已設定以下環境變數："
        echo "   - VITE_FIREBASE_API_KEY"
        echo "   - VITE_FIREBASE_AUTH_DOMAIN"
        echo "   - VITE_FIREBASE_PROJECT_ID"
        echo "   - VITE_FIREBASE_STORAGE_BUCKET"
        echo "   - VITE_FIREBASE_MESSAGING_SENDER_ID"
        echo "   - VITE_FIREBASE_APP_ID"
        echo ""
        read -p "按 Enter 繼續部署..."
        vercel --prod
        ;;
    2)
        echo ""
        echo "🌐 部署前端到 Netlify..."
        if ! check_command "netlify"; then
            echo "正在安裝 Netlify CLI..."
            npm install -g netlify-cli
        fi
        cd frontend
        npm run build
        echo ""
        echo "⚠️  請確保已在 Netlify Dashboard 設定環境變數"
        echo ""
        read -p "按 Enter 繼續部署..."
        netlify deploy --prod
        ;;
    3)
        echo ""
        echo "⚙️  準備後端部署到 Railway..."
        echo ""
        echo "⚠️  部署步驟："
        echo "1. 前往 https://railway.app/ 並登入"
        echo "2. 建立新專案並連接 GitHub repository"
        echo "3. 在 Railway Dashboard 設定環境變數："
        echo "   - OPENAI_API_KEY=your_key"
        echo "4. 在 Settings > Secrets 上傳 serviceAccountKey.json"
        echo "5. Railway 會自動偵測 Dockerfile 並部署"
        echo ""
        echo "✅ 後端檔案已準備就緒！"
        ;;
    4)
        echo ""
        echo "⚙️  準備後端部署到 Render..."
        echo ""
        echo "⚠️  部署步驟："
        echo "1. 前往 https://render.com/ 並登入"
        echo "2. 建立新的 Web Service 並連接 GitHub"
        echo "3. 設定環境變數：OPENAI_API_KEY"
        echo "4. 上傳 serviceAccountKey.json 作為 Secret File"
        echo "5. Render 會使用 render.yaml 配置自動部署"
        echo ""
        echo "✅ 後端檔案已準備就緒！"
        ;;
    5)
        echo ""
        echo "🧪 執行本地測試建置..."
        echo ""
        
        # 前端建置
        echo "📦 建置前端..."
        cd frontend
        npm run build
        echo -e "${GREEN}✅ 前端建置成功！${NC}"
        echo ""
        
        # 後端檢查
        echo "🔍 檢查後端..."
        cd ../backend
        python3 check_setup.py
        ;;
    6)
        echo ""
        echo "🔍 執行完整檢查..."
        echo ""
        
        # 前端檢查
        echo "📦 檢查前端..."
        cd frontend
        if [ -f "package.json" ]; then
            echo -e "${GREEN}✅ package.json 存在${NC}"
            npm run build > /dev/null 2>&1 && echo -e "${GREEN}✅ 前端可以成功建置${NC}" || echo -e "${RED}❌ 前端建置失敗${NC}"
        else
            echo -e "${RED}❌ package.json 不存在${NC}"
        fi
        echo ""
        
        # 後端檢查
        echo "⚙️  檢查後端..."
        cd ../backend
        python3 check_setup.py
        ;;
    *)
        echo "無效選項"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo -e "${GREEN}✅ 完成！${NC}"

