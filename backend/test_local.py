#!/usr/bin/env python3
"""
本地測試腳本 - 在部署前測試完整流程
"""

import os
import sys
import datetime
import json
from pathlib import Path

# 添加當前目錄到路徑
sys.path.insert(0, os.path.dirname(__file__))

from scheduler import job_pipeline
from check_setup import check_environment

def main():
    print("=" * 60)
    print("🧪 本地測試環境")
    print("=" * 60)
    print()
    
    # 1. 檢查環境
    print("📋 [1/4] 檢查環境設定...")
    env_ok = check_environment()
    if not env_ok:
        print("❌ 環境檢查失敗，請先設定環境變數")
        print()
        print("請確認：")
        print("1. backend/.env 檔案存在且包含 OPENAI_API_KEY")
        print("2. backend/serviceAccountKey.json 存在")
        return False
    print("✅ 環境檢查通過")
    print()
    
    # 2. 檢查檔案
    print("📋 [2/4] 檢查必要檔案...")
    required_files = [
        "Dockerfile",
        "requirements.txt",
        "scheduler.py",
        "scheduler_continuous.py",
        "ai_service.py",
        "scraper.py",
        "serviceAccountKey.json"
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ 缺少必要檔案: {', '.join(missing_files)}")
        return False
    
    print("✅ 所有必要檔案存在")
    print()
    
    # 3. 檢查快取目錄
    print("📋 [3/4] 檢查快取目錄...")
    cache_dir = Path(__file__).parent / ".llm_cache"
    cache_dir.mkdir(exist_ok=True)
    print(f"✅ 快取目錄: {cache_dir}")
    print()
    
    # 4. 執行測試流程
    print("📋 [4/4] 執行測試流程...")
    print("=" * 60)
    print()
    
    try:
        # 記錄開始時間
        start_time = datetime.datetime.now()
        
        job_pipeline()
        
        # 記錄結束時間
        end_time = datetime.datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        print()
        print("=" * 60)
        print("✅ 測試完成！")
        print(f"⏱️  執行時間: {duration:.2f} 秒")
        print("=" * 60)
        print()
        
        # 顯示快取統計
        print("📊 快取統計:")
        try:
            from cache_manager import get_cache_stats
            stats = get_cache_stats()
            print(json.dumps(stats, indent=2, ensure_ascii=False))
            
            if stats['total'] == 0:
                print()
                print("⚠️  警告: 快取為空，可能的原因：")
                print("1. 沒有抓取到新聞（RSS 來源可能沒有24小時內的新聞）")
                print("2. 所有分析都失敗了")
                print("3. 快取機制未正常運作")
                print()
                print("建議：")
                print("- 檢查 scraper.py 的 RSS 來源是否正常")
                print("- 檢查 OpenAI API Key 是否有效")
                print("- 查看上方的執行日誌確認是否有錯誤")
        except Exception as e:
            print(f"⚠️  無法取得快取統計: {e}")
        
        print()
        
        # 檢查 Firestore
        print("📊 Firestore 檢查:")
        try:
            import firebase_admin
            from firebase_admin import firestore
            
            if firebase_admin._apps:
                db = firestore.client()
                today_str = datetime.datetime.now().strftime("%Y-%m-%d")
                doc_ref = db.collection('daily_news').document(today_str)
                doc = doc_ref.get()
                
                if doc.exists:
                    data = doc.to_dict()
                    print(f"✅ 找到今日日報: {today_str}")
                    print(f"   - 文章數: {data.get('article_count', 0)}")
                    print(f"   - 分類數: {data.get('category_count', 0)}")
                    print(f"   - 狀態: {data.get('status', 'unknown')}")
                    print(f"   - 建立時間: {data.get('created_at', 'N/A')}")
                else:
                    print(f"❌ 未找到今日日報: {today_str}")
                    print("   可能的原因：")
                    print("   1. 寫入失敗（檢查上方日誌）")
                    print("   2. 沒有新聞可處理")
                    print("   3. Firebase 配置錯誤")
        except Exception as e:
            print(f"⚠️  無法檢查 Firestore: {e}")
        
        print()
        return True
        
    except Exception as e:
        print()
        print("=" * 60)
        print(f"❌ 測試失敗: {e}")
        print("=" * 60)
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
