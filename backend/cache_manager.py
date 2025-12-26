"""
LLM 結果快取管理器
避免對相同內容重複呼叫 LLM API
"""

import os
import json
import hashlib
from pathlib import Path
from datetime import datetime, timedelta

# 快取目錄
CACHE_DIR = Path(__file__).parent / ".llm_cache"
CACHE_DIR.mkdir(exist_ok=True)

# 快取過期時間（天）
CACHE_EXPIRY_DAYS = 7

def get_content_hash(content, metadata=None):
    """
    生成內容的雜湊值
    
    Args:
        content: 主要內容（新聞內容）
        metadata: 可選的 metadata（title, source 等）
    
    Returns:
        str: 內容的 MD5 雜湊值
    """
    # 組合內容和 metadata
    combined = content[:2000]  # 只取前2000字作為關鍵部分
    
    if metadata:
        # 加入 metadata 但不包括時間（時間不影響內容分析）
        if isinstance(metadata, dict):
            combined += str(metadata.get('title', ''))
            combined += str(metadata.get('source', ''))
    
    # 生成 MD5 雜湊
    return hashlib.md5(combined.encode('utf-8')).hexdigest()

def get_cache_path(cache_key, cache_type="article"):
    """
    取得快取檔案路徑
    
    Args:
        cache_key: 快取鍵值（雜湊值）
        cache_type: 快取類型（article, category, briefing）
    
    Returns:
        Path: 快取檔案路徑
    """
    return CACHE_DIR / f"{cache_type}_{cache_key}.json"

def is_cache_valid(cache_path):
    """
    檢查快取是否有效（未過期）
    
    Args:
        cache_path: 快取檔案路徑
    
    Returns:
        bool: 快取是否有效
    """
    if not cache_path.exists():
        return False
    
    # 檢查檔案修改時間
    mtime = datetime.fromtimestamp(cache_path.stat().st_mtime)
    age = datetime.now() - mtime
    
    return age < timedelta(days=CACHE_EXPIRY_DAYS)

def get_cached_result(cache_key, cache_type="article"):
    """
    從快取取得結果
    
    Args:
        cache_key: 快取鍵值
        cache_type: 快取類型
    
    Returns:
        dict: 快取的結果，如果不存在或過期則返回 None
    """
    cache_path = get_cache_path(cache_key, cache_type)
    
    if not is_cache_valid(cache_path):
        return None
    
    try:
        with open(cache_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"💾 [Cache] 使用快取結果: {cache_type} ({cache_key[:8]}...)")
            return data.get('result')
    except Exception as e:
        print(f"⚠️ [Cache] 讀取快取失敗: {e}")
        return None

def save_cached_result(cache_key, result, cache_type="article", metadata=None):
    """
    儲存結果到快取
    
    Args:
        cache_key: 快取鍵值
        result: 要快取的結果
        cache_type: 快取類型
        metadata: 可選的 metadata（用於記錄）
    """
    cache_path = get_cache_path(cache_key, cache_type)
    
    try:
        data = {
            'result': result,
            'cached_at': datetime.now().isoformat(),
            'cache_type': cache_type,
            'metadata': metadata or {}
        }
        
        with open(cache_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"💾 [Cache] 已儲存快取: {cache_type} ({cache_key[:8]}...)")
    except Exception as e:
        print(f"⚠️ [Cache] 儲存快取失敗: {e}")

def clear_expired_cache():
    """
    清除過期的快取檔案
    """
    if not CACHE_DIR.exists():
        return
    
    expired_count = 0
    for cache_file in CACHE_DIR.glob("*.json"):
        if not is_cache_valid(cache_file):
            try:
                cache_file.unlink()
                expired_count += 1
            except Exception as e:
                print(f"⚠️ [Cache] 刪除過期快取失敗: {e}")
    
    if expired_count > 0:
        print(f"🗑️ [Cache] 已清除 {expired_count} 個過期快取檔案")

def get_cache_stats():
    """
    取得快取統計資訊
    
    Returns:
        dict: 快取統計資訊
    """
    if not CACHE_DIR.exists():
        return {'total': 0, 'by_type': {}}
    
    stats = {'total': 0, 'by_type': {}}
    
    for cache_file in CACHE_DIR.glob("*.json"):
        stats['total'] += 1
        cache_type = cache_file.stem.split('_')[0]
        stats['by_type'][cache_type] = stats['by_type'].get(cache_type, 0) + 1
    
    return stats

