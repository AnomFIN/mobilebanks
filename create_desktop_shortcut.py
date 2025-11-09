#!/usr/bin/env python3
"""
Create Desktop Shortcut for MobileBanks Web Launcher
====================================================

This script creates a shortcut on the Windows Desktop for easy access to the web server launcher.
"""

import os
import sys
from pathlib import Path

def create_windows_shortcut():
    """Create a Windows shortcut on the Desktop"""
    try:
        import winshell
        from win32com.client import Dispatch
    except ImportError:
        print("Installing required packages...")
        import subprocess
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pywin32', 'winshell'])
        import winshell
        from win32com.client import Dispatch
    
    # Get paths
    script_dir = Path(__file__).parent
    bat_file = script_dir / "Launch_Web_Server.bat"
    desktop = Path(winshell.desktop())
    shortcut_path = desktop / "MobileBanks Web Server.lnk"
    
    # Create shortcut
    shell = Dispatch('WScript.Shell')
    shortcut = shell.CreateShortCut(str(shortcut_path))
    shortcut.Targetpath = str(bat_file)
    shortcut.WorkingDirectory = str(script_dir)
    shortcut.IconLocation = str(bat_file)
    shortcut.Description = "Launch MobileBanks Web Server"
    shortcut.save()
    
    print(f"✅ Shortcut created successfully at: {shortcut_path}")
    return True

def create_manual_instructions():
    """Show manual instructions for creating a shortcut"""
    script_dir = Path(__file__).parent
    bat_file = script_dir / "Launch_Web_Server.bat"
    
    print("\n" + "="*60)
    print("Manual Shortcut Creation Instructions")
    print("="*60)
    print("\nTo create a desktop shortcut manually:")
    print("\n1. Right-click on your Desktop")
    print("2. Select 'New' → 'Shortcut'")
    print("3. Click 'Browse' and navigate to:")
    print(f"   {bat_file}")
    print("4. Click 'Next'")
    print("5. Name it 'MobileBanks Web Server'")
    print("6. Click 'Finish'")
    print("\nAlternatively, you can:")
    print("• Right-click on Launch_Web_Server.bat")
    print("• Select 'Send to' → 'Desktop (create shortcut)'")
    print()

def main():
    """Main entry point"""
    print("\n🚀 MobileBanks Desktop Shortcut Creator")
    print("="*60 + "\n")
    
    if os.name != 'nt':
        print("ℹ️  This script is designed for Windows.")
        print("\nOn Linux/Mac, you can run the launcher directly:")
        print("  python3 launch_web_server.py")
        print("\nOr create an alias in your shell profile:")
        print("  alias mobilebanks='cd /path/to/mobilebanks && python3 launch_web_server.py'")
        return
    
    try:
        print("Creating desktop shortcut...")
        if create_windows_shortcut():
            print("\n✅ You can now launch the web server from your Desktop!")
    except Exception as e:
        print(f"\n⚠️  Automatic shortcut creation failed: {e}")
        print("\nNo worries! You can create it manually:")
        create_manual_instructions()
    
    print("\n" + "="*60)
    input("\nPress Enter to exit...")

if __name__ == "__main__":
    main()
