#!/usr/bin/env python3
"""
Web Server Launcher for MobileBanks
====================================

This script launches a web server for the web/ folder and provides options to:
1. Run a local Python HTTP server
2. Run with ngrok for public internet access

Usage:
    python launch_web_server.py              # Interactive mode (menu)
    python launch_web_server.py --local      # Start local server directly
    python launch_web_server.py --ngrok      # Start with ngrok directly
    python launch_web_server.py --port 8080  # Use custom port
    
    Or double-click the .bat file on Windows
"""

import os
import sys
import subprocess
import shutil
import time
import webbrowser
import argparse
from pathlib import Path

# Color codes for terminal output
if os.name == 'nt':  # Windows
    os.system('color')

class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_color(text, color=Colors.ENDC):
    """Print colored text"""
    print(f"{color}{text}{Colors.ENDC}")

def print_banner():
    """Print application banner"""
    print_color("\n" + "="*60, Colors.CYAN)
    print_color("          MobileBanks Web Server Launcher", Colors.BOLD + Colors.HEADER)
    print_color("="*60, Colors.CYAN)
    print()

def check_ngrok_installed():
    """Check if ngrok is installed and available"""
    return shutil.which('ngrok') is not None

def get_web_directory():
    """Get the web directory path"""
    script_dir = Path(__file__).parent
    web_dir = script_dir / 'web'
    
    if not web_dir.exists():
        print_color(f"❌ Error: web/ directory not found at {web_dir}", Colors.RED)
        sys.exit(1)
    
    return web_dir

def start_local_server(web_dir, port=8000):
    """Start a local Python HTTP server"""
    print_color(f"\n🚀 Starting local web server on port {port}...", Colors.GREEN)
    print_color(f"📁 Serving directory: {web_dir}", Colors.BLUE)
    print()
    
    local_url = f"http://localhost:{port}"
    print_color(f"✅ Server started successfully!", Colors.GREEN)
    print_color(f"🌐 Local URL: {local_url}", Colors.CYAN + Colors.BOLD)
    print()
    print_color("📝 Access the application at:", Colors.YELLOW)
    print_color(f"   • Local:   {local_url}", Colors.CYAN)
    print_color(f"   • Network: http://<your-ip>:{port}", Colors.CYAN)
    print()
    print_color("💡 Press Ctrl+C to stop the server", Colors.YELLOW)
    print()
    
    # Open browser after a short delay
    time.sleep(2)
    print_color("🌐 Opening browser...", Colors.BLUE)
    webbrowser.open(local_url)
    
    # Start the server
    os.chdir(web_dir)
    try:
        subprocess.run([sys.executable, '-m', 'http.server', str(port)])
    except KeyboardInterrupt:
        print_color("\n\n✋ Server stopped by user", Colors.YELLOW)
    except Exception as e:
        print_color(f"\n❌ Error: {e}", Colors.RED)

def start_ngrok_server(web_dir, port=8000):
    """Start a local server and expose it with ngrok"""
    print_color(f"\n🚀 Starting local web server on port {port}...", Colors.GREEN)
    print_color(f"📁 Serving directory: {web_dir}", Colors.BLUE)
    print()
    
    # Change to web directory
    os.chdir(web_dir)
    
    # Start local server in background
    print_color("🔧 Starting Python HTTP server...", Colors.BLUE)
    server_process = subprocess.Popen(
        [sys.executable, '-m', 'http.server', str(port)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    
    # Wait for server to start
    time.sleep(2)
    
    # Start ngrok
    print_color("🌍 Starting ngrok tunnel...", Colors.CYAN)
    print()
    
    try:
        ngrok_process = subprocess.Popen(
            ['ngrok', 'http', str(port)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        print_color("✅ Ngrok tunnel started!", Colors.GREEN)
        print_color("🌐 Public URL will be displayed in the ngrok window", Colors.CYAN)
        print()
        print_color("📝 Instructions:", Colors.YELLOW)
        print_color("   1. Look for the 'Forwarding' line in the ngrok window", Colors.CYAN)
        print_color("   2. Copy the https://xxxxx.ngrok.io URL", Colors.CYAN)
        print_color("   3. Share that URL to access your app from anywhere!", Colors.CYAN)
        print()
        print_color("💡 Press Ctrl+C to stop both servers", Colors.YELLOW)
        print()
        
        # Wait for ngrok to be stopped
        ngrok_process.wait()
        
    except KeyboardInterrupt:
        print_color("\n\n✋ Stopping servers...", Colors.YELLOW)
    except Exception as e:
        print_color(f"\n❌ Error: {e}", Colors.RED)
    finally:
        # Clean up processes
        try:
            server_process.terminate()
            server_process.wait(timeout=5)
        except:
            server_process.kill()
        
        try:
            if 'ngrok_process' in locals():
                ngrok_process.terminate()
                ngrok_process.wait(timeout=5)
        except:
            if 'ngrok_process' in locals():
                ngrok_process.kill()
        
        print_color("✅ Servers stopped", Colors.GREEN)

def show_menu():
    """Display the main menu and get user choice"""
    print_color("🎯 Choose how to access the application:", Colors.BOLD)
    print()
    print_color("  1️⃣  Local network only (localhost)", Colors.CYAN)
    print_color("      • Fast and simple", Colors.BLUE)
    print_color("      • Access from this computer or local network", Colors.BLUE)
    print_color("      • No internet required", Colors.BLUE)
    print()
    print_color("  2️⃣  Public internet (with ngrok)", Colors.CYAN)
    
    if not check_ngrok_installed():
        print_color("      ⚠️  ngrok is not installed!", Colors.RED)
        print_color("      • Install from: https://ngrok.com/download", Colors.YELLOW)
    else:
        print_color("      • Access from anywhere on the internet", Colors.BLUE)
        print_color("      • Share with others easily", Colors.BLUE)
        print_color("      • Requires ngrok account (free)", Colors.BLUE)
    
    print()
    print_color("  3️⃣  Exit", Colors.CYAN)
    print()
    
    while True:
        choice = input(f"{Colors.BOLD}Enter your choice (1-3): {Colors.ENDC}").strip()
        
        if choice in ['1', '2', '3']:
            return choice
        else:
            print_color("❌ Invalid choice. Please enter 1, 2, or 3.", Colors.RED)

def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description='Launch MobileBanks web server',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python launch_web_server.py              # Interactive menu
  python launch_web_server.py --local      # Start local server
  python launch_web_server.py --ngrok      # Start with ngrok
  python launch_web_server.py --port 8080  # Use port 8080
        """
    )
    
    parser.add_argument(
        '--local',
        action='store_true',
        help='Start local server directly (no menu)'
    )
    
    parser.add_argument(
        '--ngrok',
        action='store_true',
        help='Start with ngrok directly (no menu)'
    )
    
    parser.add_argument(
        '--port',
        type=int,
        default=8000,
        help='Port to use (default: 8000)'
    )
    
    parser.add_argument(
        '--no-browser',
        action='store_true',
        help='Do not open browser automatically'
    )
    
    return parser.parse_args()

def main():
    """Main application entry point"""
    # Parse command line arguments
    args = parse_arguments()
    
    # Get web directory
    web_dir = get_web_directory()
    
    # Use custom port if specified
    port = args.port
    
    # Check for direct mode (skip menu)
    if args.local:
        print_banner()
        print_color("🚀 Starting in LOCAL mode...\n", Colors.GREEN)
        start_local_server(web_dir, port)
        return
    
    if args.ngrok:
        print_banner()
        if not check_ngrok_installed():
            print_color("\n❌ Error: ngrok is not installed!", Colors.RED)
            print_color("\n📥 To install ngrok:", Colors.YELLOW)
            print_color("   1. Visit: https://ngrok.com/download", Colors.CYAN)
            print_color("   2. Download and install ngrok", Colors.CYAN)
            print_color("   3. Sign up for a free account at https://ngrok.com", Colors.CYAN)
            print_color("   4. Run 'ngrok authtoken <your-token>' to authenticate", Colors.CYAN)
            print()
            input("Press Enter to exit...")
            sys.exit(1)
        
        print_color("🌍 Starting in NGROK mode...\n", Colors.CYAN)
        start_ngrok_server(web_dir, port)
        return
    
    # Interactive mode (default)
    print_banner()
    
    # Show menu and get choice
    choice = show_menu()
    
    if choice == '1':
        # Local server
        start_local_server(web_dir, port)
    
    elif choice == '2':
        # Public server with ngrok
        if not check_ngrok_installed():
            print_color("\n❌ Error: ngrok is not installed!", Colors.RED)
            print_color("\n📥 To install ngrok:", Colors.YELLOW)
            print_color("   1. Visit: https://ngrok.com/download", Colors.CYAN)
            print_color("   2. Download and install ngrok", Colors.CYAN)
            print_color("   3. Sign up for a free account at https://ngrok.com", Colors.CYAN)
            print_color("   4. Run 'ngrok authtoken <your-token>' to authenticate", Colors.CYAN)
            print()
            input("Press Enter to exit...")
            sys.exit(1)
        
        start_ngrok_server(web_dir, port)
    
    elif choice == '3':
        # Exit
        print_color("\n👋 Goodbye!", Colors.CYAN)
        sys.exit(0)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print_color("\n\n✋ Interrupted by user", Colors.YELLOW)
        sys.exit(0)
    except Exception as e:
        print_color(f"\n❌ An error occurred: {e}", Colors.RED)
        import traceback
        traceback.print_exc()
        input("\nPress Enter to exit...")
        sys.exit(1)
