#!/usr/bin/env python3
"""
部署前檢查腳本
確認所有必要的配置和檔案都已就緒
"""
import os
import sys
from pathlib import Path

def check_file_exists(filepath, description):
    """檢查檔案是否存在"""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description} 不存在: {filepath}")
        return False

def check_env_var(var_name, description):
    """檢查環境變數是否存在"""
    value = os.getenv(var_name)
    if value:
        print(f"✅ {description}: 已設定")
        return True
    else:
        print(f"❌ {description} 未設定: {var_name}")
        return False

def main():
    print("🔍 開始檢查部署設定...\n")
    
    errors = []
    
    # 檢查後端檔案
    backend_dir = Path(__file__).parent
    
    # 1. 檢查必要檔案
    required_files = [
        ("scheduler.py", "排程器主程式"),
        ("scraper.py", "新聞抓取模組"),
        ("ai_service.py", "AI 服務模組"),
        ("requirements.txt", "依賴清單"),
    ]
    
    for filename, desc in required_files:
        filepath = backend_dir / filename
        if not check_file_exists(str(filepath), desc):
            errors.append(f"缺少檔案: {filename}")
    
    # 2. 檢查服務帳號金鑰
    service_key_path = backend_dir / "serviceAccountKey.json"
    if not check_file_exists(str(service_key_path), "Firebase 服務帳號金鑰"):
        errors.append("缺少 serviceAccountKey.json")
        print("   💡 提示: 從 Firebase Console > Project Settings > Service Accounts 下載")
    
    # 3. 檢查環境變數
    openai_key = os.getenv("OPENAI_API_KEY")
    if not check_env_var("OPENAI_API_KEY", "OpenAI API Key"):
        errors.append("未設定 OPENAI_API_KEY")
        print("   💡 提示: 在 .env 檔案中設定，或透過環境變數設定")
    
    # 4. 檢查 Python 依賴
    try:
        import firebase_admin
        print("✅ Firebase Admin SDK: 已安裝")
    except ImportError:
        errors.append("未安裝 firebase-admin")
        print("   💡 執行: pip install -r requirements.txt")
    
    try:
        import openai
        print("✅ OpenAI SDK: 已安裝")
    except ImportError:
        errors.append("未安裝 openai")
        print("   💡 執行: pip install -r requirements.txt")
    
    try:
        import feedparser
        print("✅ feedparser: 已安裝")
    except ImportError:
        errors.append("未安裝 feedparser")
        print("   💡 執行: pip install -r requirements.txt")
    
    # 總結
    print("\n" + "="*50)
    if errors:
        print(f"❌ 發現 {len(errors)} 個問題:")
        for error in errors:
            print(f"   - {error}")
        print("\n請修正上述問題後再進行部署。")
        sys.exit(1)
    else:
        print("✅ 所有檢查通過！可以開始部署了。")
        sys.exit(0)

if __name__ == "__main__":
    main()

