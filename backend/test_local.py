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
    print("📋 [1/3] 檢查環境設定...")
    env_ok = check_environment()
    if not env_ok:
        print("❌ 環境檢查失敗，請先設定環境變數")
        return False
    print("✅ 環境檢查通過")
    print()
    
    # 2. 檢查檔案
    print("📋 [2/3] 檢查必要檔案...")
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
    
    # 3. 執行測試流程
    print("📋 [3/3] 執行測試流程...")
    print()
    
    try:
        job_pipeline()
        print()
        print("=" * 60)
        print("✅ 測試完成！")
        print("=" * 60)
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

