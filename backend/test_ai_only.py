#!/usr/bin/env python3
"""
測試 AI 分析功能
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from ai_service import analyze_article
from cache_manager import get_cache_stats

print("🧪 測試 AI 分析功能")
print("=" * 60)
print()

# 測試文章
test_article = """
OpenAI 發布了最新的 GPT-4 Turbo 模型，在處理速度和成本效益方面有顯著提升。
新模型處理速度提升2倍，成本降低50%，並支援更長的上下文。
這將加速企業採用 AI 技術，並促使競爭對手跟進。
"""

print("📝 測試文章內容:")
print(test_article[:100] + "...")
print()

print("🤖 開始 AI 分析...")
result = analyze_article(
    text=test_article,
    title="OpenAI 發布 GPT-4 Turbo",
    source="Test Source",
    published_at="2025-12-26T10:00:00Z"
)

print()
print("=" * 60)

if result:
    print("✅ AI 分析成功！")
    print()
    print("📊 分析結果:")
    print(f"  - 分類: {result.get('category', 'N/A')}")
    print(f"  - 摘要: {result.get('summary', 'N/A')[:100]}...")
    print(f"  - 信心度: {result.get('confidence', 0.0):.2f}")
    print(f"  - 情緒: {result.get('sentiment', 'N/A')}")
    print()
    
    # 檢查快取
    stats = get_cache_stats()
    print("📊 快取統計:")
    print(f"  - 總數: {stats['total']}")
    print(f"  - 按類型: {stats['by_type']}")
else:
    print("❌ AI 分析失敗")
    print()
    print("可能的原因：")
    print("1. OPENAI_API_KEY 未設定或無效")
    print("2. 網路連線問題")
    print("3. OpenAI API 配額用盡")

