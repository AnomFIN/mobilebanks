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
import json
import urllib.request
import urllib.error
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

def check_ngrok_authenticated():
    """Check if ngrok is authenticated with an authtoken"""
    try:
        # Try to get ngrok config
        result = subprocess.run(
            ['ngrok', 'config', 'check'],
            capture_output=True,
            text=True,
            timeout=5
        )
        # If config check succeeds, ngrok is properly configured
        return result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
        # If command fails or times out, try another method
        pass
    
    # Alternative: Try to start ngrok briefly and see if it complains about auth
    try:
        # Run ngrok with a quick test
        result = subprocess.run(
            ['ngrok', 'version'],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            # ngrok is installed, but we can't easily check auth without starting it
            # We'll return True and let the actual start handle auth issues
            return True
    except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
        pass
    
    return False

def setup_ngrok_authtoken():
    """Interactively setup ngrok authtoken"""
    print_color("\n" + "="*60, Colors.YELLOW)
    print_color("  🔑 Ngrok Authentication Required", Colors.BOLD + Colors.YELLOW)
    print_color("="*60, Colors.YELLOW)
    print()
    
    print_color("Ngrok requires a free account and authtoken to work.", Colors.CYAN)
    print_color("Don't worry, it's quick and free! Follow these steps:", Colors.CYAN)
    print()
    
    print_color("📋 Steps to get your authtoken:", Colors.BOLD)
    print_color("   1. Visit: https://dashboard.ngrok.com/signup", Colors.CYAN)
    print_color("   2. Sign up for a free account (takes 1 minute)", Colors.CYAN)
    print_color("   3. After login, go to: https://dashboard.ngrok.com/get-started/your-authtoken", Colors.CYAN)
    print_color("   4. Copy your authtoken from the dashboard", Colors.CYAN)
    print()
    
    # Ask user if they want to continue
    print_color("Do you have an ngrok account or want to create one now?", Colors.BOLD)
    response = input(f"{Colors.CYAN}Enter 'yes' to continue, or 'no' to exit: {Colors.ENDC}").strip().lower()
    
    if response not in ['yes', 'y']:
        print_color("\n👋 Setup cancelled. You can run this again when you have an authtoken.", Colors.YELLOW)
        return False
    
    print()
    print_color("="*60, Colors.CYAN)
    print_color("  Enter Your Authtoken", Colors.BOLD)
    print_color("="*60, Colors.CYAN)
    print()
    
    print_color("Paste your ngrok authtoken here:", Colors.BOLD)
    print_color("(It should look like: 2abc...xyz123)", Colors.BLUE)
    print()
    
    authtoken = input(f"{Colors.CYAN}Authtoken: {Colors.ENDC}").strip()
    
    if not authtoken:
        print_color("\n❌ No authtoken provided. Setup cancelled.", Colors.RED)
        return False
    
    # Validate authtoken format (basic check)
    if len(authtoken) < 20:
        print_color("\n⚠️  Warning: This authtoken looks too short. It might be invalid.", Colors.YELLOW)
        response = input(f"{Colors.CYAN}Continue anyway? (yes/no): {Colors.ENDC}").strip().lower()
        if response not in ['yes', 'y']:
            print_color("\n👋 Setup cancelled.", Colors.YELLOW)
            return False
    
    print()
    print_color("🔧 Configuring ngrok with your authtoken...", Colors.BLUE)
    
    try:
        # Configure ngrok with the authtoken
        result = subprocess.run(
            ['ngrok', 'config', 'add-authtoken', authtoken],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            print_color("✅ Authtoken configured successfully!", Colors.GREEN)
            print_color("\n🎉 You're all set! Ngrok is now ready to use.", Colors.GREEN)
            print()
            return True
        else:
            print_color(f"\n❌ Failed to configure authtoken.", Colors.RED)
            if result.stderr:
                print_color(f"Error: {result.stderr}", Colors.RED)
            return False
            
    except subprocess.TimeoutExpired:
        print_color("\n❌ Configuration timed out. Please try again.", Colors.RED)
        return False
    except Exception as e:
        print_color(f"\n❌ Error configuring authtoken: {e}", Colors.RED)
        return False

def get_ngrok_public_url(max_attempts=10, delay=1):
    """
    Get the public URL from ngrok's local API
    
    Args:
        max_attempts: Maximum number of attempts to get the URL
        delay: Delay between attempts in seconds
        
    Returns:
        The public URL or None if not found
    """
    api_url = "http://localhost:4040/api/tunnels"
    
    for attempt in range(max_attempts):
        try:
            # Query ngrok's local API
            with urllib.request.urlopen(api_url, timeout=2) as response:
                data = json.loads(response.read().decode())
                
                # Extract tunnels
                tunnels = data.get('tunnels', [])
                
                # Find the public HTTPS URL
                for tunnel in tunnels:
                    public_url = tunnel.get('public_url', '')
                    if public_url.startswith('https://'):
                        return public_url
                    
        except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError, Exception):
            # API not ready yet, wait and retry
            if attempt < max_attempts - 1:
                time.sleep(delay)
            continue
    
    return None

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
    print_color("⏳ Please wait while we establish the connection...", Colors.BLUE)
    print()
    
    ngrok_process = None
    try:
        ngrok_process = subprocess.Popen(
            ['ngrok', 'http', str(port), '--log=stdout'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait for ngrok to start and get the public URL
        print_color("🔍 Retrieving your public URL...", Colors.BLUE)
        public_url = get_ngrok_public_url(max_attempts=15, delay=1)
        
        if public_url:
            print_color("\n" + "="*60, Colors.GREEN)
            print_color("  ✅ SUCCESS! Your app is now publicly accessible!", Colors.BOLD + Colors.GREEN)
            print_color("="*60, Colors.GREEN)
            print()
            print_color("🌐 Public URL:", Colors.BOLD)
            print_color(f"   {public_url}", Colors.CYAN + Colors.BOLD)
            print()
            print_color("📱 Share this URL with anyone to give them access!", Colors.CYAN)
            print_color("🔒 The URL uses HTTPS for secure access", Colors.CYAN)
            print()
            print_color("💡 Tips:", Colors.YELLOW)
            print_color("   • This URL works from anywhere on the internet", Colors.BLUE)
            print_color("   • The URL is temporary and will change when you restart", Colors.BLUE)
            print_color("   • Keep this window open to maintain the connection", Colors.BLUE)
            print()
            print_color("="*60, Colors.GREEN)
            print()
            
            # Try to open the URL in browser
            try:
                print_color("🌐 Opening public URL in browser...", Colors.BLUE)
                webbrowser.open(public_url)
            except:
                pass
                
        else:
            print_color("\n⚠️  Warning: Could not retrieve public URL from ngrok", Colors.YELLOW)
            print_color("The tunnel may still be running. Check the ngrok dashboard:", Colors.YELLOW)
            print_color("   https://dashboard.ngrok.com/tunnels/agents", Colors.CYAN)
            print()
        
        print_color("💡 Press Ctrl+C to stop both servers", Colors.YELLOW)
        print()
        
        # Keep the process running
        ngrok_process.wait()
        
    except KeyboardInterrupt:
        print_color("\n\n✋ Stopping servers...", Colors.YELLOW)
    except FileNotFoundError:
        print_color("\n❌ Error: ngrok command not found!", Colors.RED)
        print_color("Please make sure ngrok is installed and in your PATH.", Colors.RED)
    except Exception as e:
        print_color(f"\n❌ Error starting ngrok: {e}", Colors.RED)
        
        # Check if it's an authentication error
        error_msg = str(e).lower()
        if 'auth' in error_msg or 'token' in error_msg:
            print_color("\n🔑 This might be an authentication issue.", Colors.YELLOW)
            print_color("Please make sure you've set up your ngrok authtoken.", Colors.YELLOW)
            print_color("Run: ngrok config add-authtoken <your-token>", Colors.CYAN)
    finally:
        # Clean up processes
        print_color("\n🧹 Cleaning up...", Colors.BLUE)
        
        try:
            server_process.terminate()
            server_process.wait(timeout=5)
        except:
            try:
                server_process.kill()
            except:
                pass
        
        try:
            if ngrok_process:
                ngrok_process.terminate()
                ngrok_process.wait(timeout=5)
        except:
            try:
                if ngrok_process:
                    ngrok_process.kill()
            except:
                pass
        
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
            print_color("   4. Run 'ngrok config add-authtoken <your-token>' to authenticate", Colors.CYAN)
            print()
            input("Press Enter to exit...")
            sys.exit(1)
        
        # Check if ngrok needs authentication setup
        if not check_ngrok_authenticated():
            print_color("\n🔑 Ngrok authentication check...", Colors.YELLOW)
            if not setup_ngrok_authtoken():
                print_color("\n❌ Cannot start ngrok without authentication.", Colors.RED)
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
            print_color("   4. Run 'ngrok config add-authtoken <your-token>' to authenticate", Colors.CYAN)
            print()
            input("Press Enter to exit...")
            sys.exit(1)
        
        # Check if ngrok needs authentication setup
        if not check_ngrok_authenticated():
            if not setup_ngrok_authtoken():
                print_color("\n❌ Cannot start ngrok without authentication.", Colors.RED)
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
