#!/bin/bash

# 首次部署協助腳本

echo "🚀 AI News Worker - 首次部署協助"
echo "=================================="
echo ""

# 檢查 Git 狀態
echo "📋 步驟 1: 檢查 Git 狀態..."
if git remote -v | grep -q "origin"; then
    echo "✅ 已連接遠端 repository"
    git remote -v
else
    echo "⚠️  尚未連接 GitHub repository"
    echo ""
    echo "請先完成以下步驟："
    echo "1. 前往 https://github.com/new 建立新 repository"
    echo "2. Repository 名稱建議: ai-news-worker"
    echo "3. 不要勾選 'Initialize with README'"
    echo "4. 建立後複製 Repository URL"
    echo ""
    read -p "請輸入您的 GitHub Repository URL (例如: https://github.com/用戶名/ai-news-worker.git): " repo_url
    
    if [ -n "$repo_url" ]; then
        echo ""
        echo "正在連接遠端 repository..."
        git remote add origin "$repo_url"
        echo "✅ 已連接: $repo_url"
        echo ""
        echo "下一步：推送到 GitHub"
        read -p "按 Enter 繼續推送..."
        git branch -M main
        git push -u origin main
    else
        echo "❌ 未輸入 URL，請稍後手動執行："
        echo "   git remote add origin <您的_repository_url>"
        echo "   git branch -M main"
        echo "   git push -u origin main"
        exit 1
    fi
fi

echo ""
echo "=================================="
echo "✅ Git 設定完成！"
echo ""
echo "📝 下一步："
echo "1. 前往 https://vercel.com/new"
echo "2. 連接 GitHub 並選擇您的 repository"
echo "3. 設定 Root Directory: frontend"
echo "4. 新增 Firebase 環境變數"
echo "5. 點擊 Deploy"
echo ""
echo "詳細步驟請參考: 首次部署步驟.md"

