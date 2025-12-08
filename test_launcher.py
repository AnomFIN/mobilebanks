#!/usr/bin/env python3
"""
Test script for the web launcher
"""

import sys
import os
from pathlib import Path

def test_imports():
    """Test that the launcher script can be imported"""
    try:
        import launch_web_server
        print("✓ launch_web_server imports successfully")
        return True
    except Exception as e:
        print(f"✗ Failed to import launch_web_server: {e}")
        return False

def test_web_directory_exists():
    """Test that the web directory exists"""
    web_dir = Path(__file__).parent / 'web'
    if web_dir.exists() and web_dir.is_dir():
        print(f"✓ web/ directory exists at: {web_dir}")
        files = list(web_dir.glob('*'))
        print(f"  Contains {len(files)} files")
        return True
    else:
        print("✗ web/ directory not found")
        return False

def test_index_html_exists():
    """Test that index.html exists in web directory"""
    index_path = Path(__file__).parent / 'web' / 'index.html'
    if index_path.exists():
        print(f"✓ index.html exists")
        size = index_path.stat().st_size
        print(f"  Size: {size} bytes")
        return True
    else:
        print("✗ index.html not found")
        return False

def test_bat_file_exists():
    """Test that the .bat file exists (Windows launcher)"""
    bat_path = Path(__file__).parent / 'Launch_Web_Server.bat'
    if bat_path.exists():
        print(f"✓ Launch_Web_Server.bat exists")
        return True
    else:
        print("✗ Launch_Web_Server.bat not found")
        return False

def test_python_http_server():
    """Test that Python HTTP server module is available"""
    try:
        import http.server
        print("✓ Python http.server module is available")
        return True
    except ImportError:
        print("✗ Python http.server module not available")
        return False

def test_ngrok_functions():
    """Test that ngrok-related functions exist and work"""
    try:
        from launch_web_server import (
            check_ngrok_installed, 
            check_ngrok_authenticated,
            get_ngrok_public_url
        )
        print("✓ Ngrok helper functions are available")
        
        # Test check_ngrok_installed
        ngrok_installed = check_ngrok_installed()
        print(f"  - ngrok installed: {ngrok_installed}")
        
        # Test that get_ngrok_public_url is callable
        if callable(get_ngrok_public_url):
            print("  - get_ngrok_public_url is callable")
        
        return True
    except Exception as e:
        print(f"✗ Failed to test ngrok functions: {e}")
        return False

def test_json_urllib_imports():
    """Test that required imports for ngrok API are available"""
    try:
        import json
        import urllib.request
        import urllib.error
        print("✓ JSON and urllib modules are available")
        return True
    except ImportError as e:
        print(f"✗ Required modules not available: {e}")
        return False

def main():
    """Run all tests"""
    print("="*60)
    print("Testing Web Launcher Components")
    print("="*60)
    print()
    
    tests = [
        test_imports,
        test_web_directory_exists,
        test_index_html_exists,
        test_bat_file_exists,
        test_python_http_server,
        test_ngrok_functions,
        test_json_urllib_imports,
    ]
    
    results = []
    for test in tests:
        result = test()
        results.append(result)
        print()
    
    print("="*60)
    passed = sum(results)
    total = len(results)
    print(f"Tests passed: {passed}/{total}")
    
    if passed == total:
        print("✓ All tests passed!")
        return 0
    else:
        print("✗ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
