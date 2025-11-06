#!/usr/bin/env python3
"""
Yritystili – Helsinki eBike Service Oy
Installation and Development Server Script

Tekstipohjainen valikko Expo-projektin asentamiseen ja käynnistämiseen.
Supports interactive menu and command-line flags for automation.
"""

import sys
import os
import subprocess
import shutil
import json
import argparse
from pathlib import Path

# ANSI color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header():
    """Print application header."""
    print(f"\n{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}  Yritystili – Helsinki eBike Service Oy{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}  Installation & Development Server{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}\n")

def print_success(message):
    """Print success message."""
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")

def print_error(message):
    """Print error message."""
    print(f"{Colors.RED}✗ {message}{Colors.END}")

def print_warning(message):
    """Print warning message."""
    print(f"{Colors.YELLOW}⚠ {message}{Colors.END}")

def print_info(message):
    """Print info message."""
    print(f"{Colors.BLUE}ℹ {message}{Colors.END}")

def check_command_exists(command):
    """Check if a command exists in PATH."""
    return shutil.which(command) is not None

def run_command(command, shell=True, check=True, capture_output=False):
    """Run a shell command and return the result."""
    try:
        result = subprocess.run(
            command,
            shell=shell,
            check=check,
            capture_output=capture_output,
            text=True
        )
        return result
    except subprocess.CalledProcessError as e:
        return e

def check_tools():
    """Check if required tools are installed."""
    print(f"\n{Colors.BOLD}Tarkistetaan työkalut...{Colors.END}")
    
    tools = {
        'node': 'Node.js',
        'npm': 'npm',
        'npx': 'npx',
        'git': 'Git'
    }
    
    all_ok = True
    for cmd, name in tools.items():
        if check_command_exists(cmd):
            version_result = run_command(f"{cmd} --version", capture_output=True)
            version = version_result.stdout.strip() if hasattr(version_result, 'stdout') else 'unknown'
            print_success(f"{name} löytyi (versio: {version})")
        else:
            print_error(f"{name} ei löytynyt!")
            all_ok = False
    
    if not all_ok:
        print_warning("\nVarmista että kaikki työkalut on asennettu:")
        print("  - Node.js: https://nodejs.org/")
        print("  - npm tulee Node.js:n mukana")
        print("  - Git: https://git-scm.com/")
        return False
    
    return True

def check_engines():
    """Check package.json engines requirements."""
    print(f"\n{Colors.BOLD}Tarkistetaan package.json engines...{Colors.END}")
    
    package_json_path = Path('package.json')
    if not package_json_path.exists():
        print_error("package.json ei löytynyt!")
        return False
    
    try:
        with open(package_json_path, 'r') as f:
            package_data = json.load(f)
        
        engines = package_data.get('engines', {})
        if engines:
            print_info(f"Engines-vaatimukset: {engines}")
            # Note: In this simple version, we just display the requirements
            # Real version check could be implemented if needed
            print_success("Engines-tarkistus ohitettu (yksinkertaistettu versio)")
        else:
            print_info("Ei engines-vaatimuksia package.json:ssa")
        
        return True
    except Exception as e:
        print_error(f"Virhe luettaessa package.json: {e}")
        return False

def detect_package_manager():
    """Detect whether to use yarn or npm."""
    if check_command_exists('yarn') and Path('yarn.lock').exists():
        return 'yarn'
    return 'npm'

def install_dependencies():
    """Install project dependencies."""
    print(f"\n{Colors.BOLD}Asennetaan riippuvuuksia...{Colors.END}")
    
    package_manager = detect_package_manager()
    print_info(f"Käytetään package manageria: {package_manager}")
    
    cmd = f"{package_manager} install"
    print(f"Suoritetaan: {cmd}")
    
    result = run_command(cmd, check=False)
    
    if isinstance(result, subprocess.CalledProcessError) or result.returncode != 0:
        print_error("Riippuvuuksien asennus epäonnistui!")
        return False
    
    print_success("Riippuvuudet asennettu onnistuneesti!")
    return True

def handle_expo_login():
    """Handle Expo login with EXPO_TOKEN support."""
    print(f"\n{Colors.BOLD}Tarkistetaan Expo-kirjautuminen...{Colors.END}")
    
    # Check if EXPO_TOKEN is set
    if os.environ.get('EXPO_TOKEN'):
        print_success("EXPO_TOKEN löytyi ympäristömuuttujista")
        return True
    
    # Check if already logged in
    result = run_command("npx expo whoami", capture_output=True, check=False)
    if result.returncode == 0:
        username = result.stdout.strip()
        if username and not username.startswith('Not logged in'):
            print_success(f"Kirjautuneena Expoon käyttäjänä: {username}")
            return True
    
    print_info("Et ole kirjautuneena Expoon")
    print_info("Voit:")
    print("  1) Kirjautua: npx expo login")
    print("  2) Asettaa EXPO_TOKEN ympäristömuuttuja")
    print("  3) Jatkaa ilman kirjautumista (jotkut ominaisuudet eivät toimi)")
    
    return True  # Non-blocking, continue anyway

def start_backend():
    """Start backend server if server.js exists."""
    print(f"\n{Colors.BOLD}Tarkistetaan backend-palvelinta...{Colors.END}")
    
    if Path('server.js').exists():
        print_info("server.js löytyi - käynnistetään backend...")
        # Start backend in background (this is a placeholder - actual implementation would need process management)
        print_warning("Backend-käynnistys: käynnistä erikseen komennolla 'node server.js' tai 'npm run start'")
        return True
    
    # Check for backend npm script
    try:
        with open('package.json', 'r') as f:
            package_data = json.load(f)
        
        scripts = package_data.get('scripts', {})
        if 'server' in scripts or 'backend' in scripts:
            print_info("Backend-skripti löytyi package.json:sta")
            print_warning("Käynnistä backend erikseen: npm run server (tai npm run backend)")
            return True
    except:
        pass
    
    print_info("Backend-palvelinta ei löytynyt (ei server.js tai backend-skriptiä)")
    return True

def display_qr_code(url=None):
    """Display QR code for the Expo development server."""
    print(f"\n{Colors.BOLD}QR-koodi:{Colors.END}")
    
    # Try to import pyqrcode
    try:
        import pyqrcode
        
        if url:
            qr = pyqrcode.create(url)
            print(qr.terminal(quiet_zone=1))
            print_success(f"Skannaa QR-koodi Expo Go -sovelluksella")
        else:
            print_info("Expo näyttää QR-koodin automaattisesti kun dev-serveri käynnistyy")
    except ImportError:
        print_warning("pyqrcode ei ole asennettu - QR-koodia ei voida näyttää")
        print_info("Asenna pyqrcode: pip install pyqrcode pypng")
        print_info("Expo näyttää QR-koodin joka tapauksessa kun dev-serveri käynnistyy")

def start_expo_dev_server(tunnel=True):
    """Start Expo development server."""
    print(f"\n{Colors.BOLD}Käynnistetään Expo dev-serveri...{Colors.END}")
    
    tunnel_flag = "--tunnel" if tunnel else ""
    cmd = f"npx expo start {tunnel_flag}".strip()
    
    print_info(f"Suoritetaan: {cmd}")
    print_info("Paina Ctrl+C lopettaaksesi")
    print()
    
    # Display QR code info (actual QR will be shown by Expo)
    display_qr_code()
    
    # Start Expo (this will block until user stops it)
    try:
        result = run_command(cmd, check=False)
        return result.returncode == 0
    except KeyboardInterrupt:
        print_info("\nExpo dev-serveri pysäytetty")
        return True

def full_guided_install():
    """Option 1: Full guided install and start."""
    print(f"\n{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}  Option 1: Full Guided Install and Start{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}")
    
    # Step 1: Check tools
    if not check_tools():
        print_error("Työkalutarkistus epäonnistui!")
        return False
    
    # Step 2: Check engines
    if not check_engines():
        print_warning("Engines-tarkistus epäonnistui, jatketaan silti...")
    
    # Step 3: Install dependencies
    if not install_dependencies():
        print_error("Riippuvuuksien asennus epäonnistui!")
        return False
    
    # Step 4: Expo login
    handle_expo_login()
    
    # Step 5: Start backend
    start_backend()
    
    # Step 6: Start Expo dev server
    start_expo_dev_server(tunnel=True)
    
    return True

def quick_start():
    """Option 2: Quick start - just start Expo dev server."""
    print(f"\n{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}  Option 2: Quick Start{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}")
    
    print_info("Oletetaan että riippuvuudet on jo asennettu")
    
    # Display QR and start Expo
    start_expo_dev_server(tunnel=True)
    
    return True

def install_only():
    """Option 3: Install dependencies only."""
    print(f"\n{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}  Option 3: Install Dependencies Only{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}")
    
    # Check tools first
    if not check_tools():
        print_error("Työkalutarkistus epäonnistui!")
        return False
    
    # Install dependencies
    if not install_dependencies():
        print_error("Riippuvuuksien asennus epäonnistui!")
        return False
    
    print_success("\nRiippuvuudet asennettu! Voit nyt käynnistää sovelluksen:")
    print(f"  {Colors.BOLD}npm start{Colors.END}")
    print(f"  tai suorita: {Colors.BOLD}python3 install.py{Colors.END} ja valitse option 2 (Quick start)")
    
    return True

def show_menu():
    """Display interactive menu."""
    print(f"\n{Colors.BOLD}Valitse toiminto:{Colors.END}")
    print(f"  {Colors.GREEN}1){Colors.END} Full guided install and start")
    print(f"     - Tarkistaa työkalut (node, npm, git)")
    print(f"     - Tarkistaa package.json engines")
    print(f"     - Asentaa riippuvuudet (npm/yarn)")
    print(f"     - Hoitaa Expo-kirjautumisen")
    print(f"     - Käynnistää backendin jos löytyy")
    print(f"     - Käynnistää Expo dev-serverin (--tunnel)")
    print()
    print(f"  {Colors.GREEN}2){Colors.END} Quick start")
    print(f"     - Käynnistää suoraan Expo dev-serverin")
    print(f"     - Olettaa riippuvuudet asennettuina")
    print()
    print(f"  {Colors.GREEN}3){Colors.END} Install dependencies only")
    print(f"     - Asentaa vain npm/yarn riippuvuudet")
    print()
    print(f"  {Colors.GREEN}4){Colors.END} Exit")
    print()
    
    while True:
        try:
            choice = input(f"{Colors.BOLD}Valintasi (1-4): {Colors.END}").strip()
            
            if choice == '1':
                return full_guided_install()
            elif choice == '2':
                return quick_start()
            elif choice == '3':
                return install_only()
            elif choice == '4':
                print_info("Poistutaan...")
                return True
            else:
                print_error("Virheellinen valinta! Valitse 1-4.")
        except (KeyboardInterrupt, EOFError):
            print_info("\nPoistutaan...")
            return True

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Yritystili Installation & Development Server',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Esimerkkejä:
  python3 install.py              # Interaktiivinen valikko
  python3 install.py --auto       # Full guided install (automaattinen)
  python3 install.py --quick      # Quick start
  python3 install.py --install-only  # Asenna vain riippuvuudet
        """
    )
    
    parser.add_argument(
        '--auto',
        action='store_true',
        help='Suorita option 1 (Full guided install) ilman interaktiota'
    )
    
    parser.add_argument(
        '--quick',
        action='store_true',
        help='Suorita option 2 (Quick start)'
    )
    
    parser.add_argument(
        '--install-only',
        action='store_true',
        help='Suorita option 3 (Install dependencies only)'
    )
    
    args = parser.parse_args()
    
    # Print header
    print_header()
    
    # Handle command-line flags
    if args.auto:
        print_info("Suoritetaan automaattinen asennus (--auto)")
        return 0 if full_guided_install() else 1
    
    elif args.quick:
        print_info("Suoritetaan quick start (--quick)")
        return 0 if quick_start() else 1
    
    elif args.install_only:
        print_info("Asennetaan vain riippuvuudet (--install-only)")
        return 0 if install_only() else 1
    
    else:
        # Interactive menu
        return 0 if show_menu() else 1

if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print_info("\nKeskeytettiin käyttäjän toimesta")
        sys.exit(0)
    except Exception as e:
        print_error(f"Odottamaton virhe: {e}")
        sys.exit(1)
