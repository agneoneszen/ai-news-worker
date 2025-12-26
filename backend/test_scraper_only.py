#!/usr/bin/env python3
"""
測試 RSS 抓取功能
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from scraper import get_today_news

print("🧪 測試 RSS 抓取功能")
print("=" * 60)
print()

news_list = get_today_news()

print()
print("=" * 60)
print(f"📊 結果: 共抓取 {len(news_list)} 篇新聞")
print("=" * 60)

if len(news_list) == 0:
    print()
    print("⚠️  沒有抓取到任何新聞，可能的原因：")
    print("1. RSS 來源沒有過去24小時內的新聞")
    print("2. RSS 來源無法訪問")
    print("3. 時間解析失敗")
    print()
    print("建議：")
    print("- 檢查網路連線")
    print("- 檢查 RSS 來源是否正常")
    print("- 可以嘗試修改 scraper.py 中的時間過濾條件")
else:
    print()
    print("✅ 成功抓取新聞，前3篇標題：")
    for i, news in enumerate(news_list[:3], 1):
        print(f"  {i}. {news.get('title', '無標題')[:60]}...")
        print(f"     來源: {news.get('source', 'N/A')}")
        print(f"     時間: {news.get('published_at', 'N/A')}")

