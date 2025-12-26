#!/bin/bash

# 前端部署腳本 - 使用 npx 執行 Vercel（無需全域安裝）

set -e

echo "🌐 前端部署到 Vercel"
echo "================================"
echo ""

cd frontend

echo "📦 檢查建置..."
npm run build

echo ""
echo "🚀 開始部署..."
echo ""
echo "⚠️  重要提示："
echo "   1. 如果還沒登入，會提示您登入 Vercel"
echo "   2. 部署時會詢問環境變數，請準備好以下 Firebase 配置："
echo "      - VITE_FIREBASE_API_KEY"
echo "      - VITE_FIREBASE_AUTH_DOMAIN"
echo "      - VITE_FIREBASE_PROJECT_ID"
echo "      - VITE_FIREBASE_STORAGE_BUCKET"
echo "      - VITE_FIREBASE_MESSAGING_SENDER_ID"
echo "      - VITE_FIREBASE_APP_ID"
echo ""
read -p "按 Enter 繼續..."

# 使用 npx 執行 vercel（無需全域安裝）
npx vercel

echo ""
echo "✅ 部署完成！"
echo ""
echo "📝 下一步："
echo "   執行 'npx vercel --prod' 進行生產環境部署"

