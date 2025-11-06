#!/usr/bin/env python3
"""
Yritystili – Helsinki eBike Service Oy
Käyttöönotto-skripti tekstipohjaisella valikolla

Asentaa riippuvuudet, tarkistaa työkalut ja käynnistää kehityspalvelimen.
"""

import os
import sys
import subprocess
import json
import re
import argparse
import time
from pathlib import Path

# Värikoodit terminaalille
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_banner():
    """Tulostaa tervetuloa-bannerin"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}  Yritystili – Helsinki eBike Service Oy{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}  Käyttöönotto-assistentti{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.END}\n")

def print_success(message):
    """Tulostaa onnistumis-viestin"""
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")

def print_error(message):
    """Tulostaa virheviestin"""
    print(f"{Colors.RED}✗ {message}{Colors.END}")

def print_warning(message):
    """Tulostaa varoitusviestin"""
    print(f"{Colors.YELLOW}⚠ {message}{Colors.END}")

def print_info(message):
    """Tulostaa info-viestin"""
    print(f"{Colors.BLUE}ℹ {message}{Colors.END}")

def check_command_exists(command):
    """Tarkistaa, onko komento saatavilla"""
    try:
        subprocess.run(
            [command, "--version"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False
        )
        return True
    except FileNotFoundError:
        return False

def get_command_version(command, version_flag="--version"):
    """Hakee komennon version"""
    try:
        result = subprocess.run(
            [command, version_flag],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False
        )
        output = result.stdout + result.stderr
        # Etsi versio-numero
        match = re.search(r'v?(\d+\.\d+\.\d+)', output)
        if match:
            return match.group(1)
        return output.strip().split('\n')[0]
    except Exception as e:
        return None

def parse_version(version_str):
    """Parsii version numeroksi vertailua varten"""
    try:
        # Poista 'v' etuliite jos on
        version_str = version_str.lstrip('v')
        parts = version_str.split('.')
        return tuple(int(p) for p in parts[:3])
    except:
        return (0, 0, 0)

def check_node_npm():
    """Tarkistaa Node.js ja npm asennuksen ja versiot"""
    print(f"\n{Colors.BOLD}Tarkistetaan Node.js ja npm...{Colors.END}")
    
    # Tarkista Node.js
    if not check_command_exists("node"):
        print_error("Node.js ei ole asennettu!")
        print_info("Asenna Node.js: https://nodejs.org/")
        print_info("Suositeltu versio: 18.x tai uudempi")
        return False
    
    node_version = get_command_version("node")
    print_success(f"Node.js löytyi: {node_version}")
    
    # Tarkista npm
    if not check_command_exists("npm"):
        print_error("npm ei ole asennettu!")
        print_info("npm tulee yleensä Node.js:n mukana")
        return False
    
    npm_version = get_command_version("npm")
    print_success(f"npm löytyi: {npm_version}")
    
    return True

def check_package_json_engines():
    """Tarkistaa package.json engines-vaatimukset"""
    package_json_path = Path("package.json")
    
    if not package_json_path.exists():
        print_warning("package.json ei löydy hakemistosta")
        return True
    
    try:
        with open(package_json_path, 'r', encoding='utf-8') as f:
            package_data = json.load(f)
        
        engines = package_data.get('engines', {})
        if not engines:
            print_info("Ei engines-vaatimuksia package.json:ssa")
            return True
        
        print(f"\n{Colors.BOLD}Tarkistetaan engines-vaatimukset...{Colors.END}")
        
        # Tarkista Node.js versio
        if 'node' in engines:
            required_node = engines['node']
            node_version = get_command_version("node")
            print_info(f"Vaadittu Node.js: {required_node}")
            print_info(f"Asennettu Node.js: {node_version}")
            
            # Yksinkertainen tarkistus: vain varoitus jos ei täsmää
            if node_version and required_node:
                # Tämä on yksinkertainen tarkistus, ei täydellistä semver-parsintaa
                required_major = re.search(r'(\d+)', required_node)
                if required_major:
                    req_major = int(required_major.group(1))
                    installed = parse_version(node_version)
                    if installed[0] < req_major:
                        print_warning(f"Node.js versio saattaa olla liian vanha")
                    else:
                        print_success("Node.js versio täyttää vaatimukset")
        
        return True
    except Exception as e:
        print_warning(f"Virhe package.json:n lukemisessa: {e}")
        return True

def install_dependencies():
    """Asentaa npm riippuvuudet"""
    print(f"\n{Colors.BOLD}Asennetaan riippuvuudet...{Colors.END}")
    
    # Tarkista onko package.json olemassa
    if not Path("package.json").exists():
        print_error("package.json ei löydy!")
        return False
    
    # Suorita npm install
    try:
        print_info("Suoritetaan: npm install")
        result = subprocess.run(
            ["npm", "install"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        
        if result.returncode == 0:
            print_success("Riippuvuudet asennettu onnistuneesti!")
            
            # Tarkista varoitukset
            if "npm WARN" in result.stdout or "deprecated" in result.stdout:
                print_warning("Asennuksessa oli varoituksia:")
                # Näytä vain ensimmäiset muutama varoitus
                warnings = [line for line in result.stdout.split('\n') if 'WARN' in line or 'deprecated' in line]
                for warning in warnings[:5]:
                    print(f"  {warning}")
                if len(warnings) > 5:
                    print(f"  ... ja {len(warnings) - 5} muuta varoitusta")
            
            return True
        else:
            print_error("Riippuvuuksien asennus epäonnistui!")
            print(result.stdout)
            return False
    except Exception as e:
        print_error(f"Virhe asennuksessa: {e}")
        return False

def check_expo_login():
    """Tarkistaa Expo kirjautumisen"""
    print(f"\n{Colors.BOLD}Tarkistetaan Expo kirjautuminen...{Colors.END}")
    
    # Tarkista EXPO_TOKEN ympäristömuuttuja
    expo_token = os.environ.get('EXPO_TOKEN')
    if expo_token:
        print_success("EXPO_TOKEN löytyi ympäristömuuttujista")
        return True
    
    # Tarkista onko Expo CLI asennettu
    if not check_command_exists("npx"):
        print_warning("npx ei löydy, Expo-tarkistus ohitetaan")
        return True
    
    # Tarkista kirjautuminen
    try:
        result = subprocess.run(
            ["npx", "expo", "whoami"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=10
        )
        
        if "Not logged in" in result.stdout or "not authenticated" in result.stdout.lower():
            print_info("Et ole kirjautunut Expoon")
            print_info("Voit kirjautua komennolla: npx expo login")
            print_info("Tai asettaa EXPO_TOKEN ympäristömuuttujan")
            return True  # Ei pakollinen, jatketaan
        else:
            username = result.stdout.strip()
            if username:
                print_success(f"Kirjautunut Expoon: {username}")
            else:
                print_info("Expo-tila tuntematon")
            return True
    except subprocess.TimeoutExpired:
        print_warning("Expo-tarkistus aikakatkaistu, jatketaan...")
        return True
    except Exception as e:
        print_warning(f"Expo-tarkistus epäonnistui: {e}")
        return True

def start_backend():
    """Käynnistää backendin jos löytyy"""
    # Tarkista onko backend-hakemisto
    backend_dirs = ['backend', 'server', 'api']
    backend_path = None
    
    for dirname in backend_dirs:
        if Path(dirname).exists() and Path(dirname).is_dir():
            backend_path = Path(dirname)
            break
    
    if not backend_path:
        print_info("Backend-hakemistoa ei löydy, ohitetaan backend-käynnistys")
        return None
    
    print(f"\n{Colors.BOLD}Käynnistetään backend...{Colors.END}")
    print_info(f"Backend löytyi: {backend_path}")
    
    # Tämä on placeholder - ei toteuteta backendia tässä vaiheessa
    # koska projektissa ei ole backendia
    print_info("Backend-käynnistys ei ole tuettu tässä versiossa")
    return None

def generate_qr_code(url):
    """Generoi QR-koodin terminaliin"""
    try:
        import pyqrcode
        qr = pyqrcode.create(url)
        print("\n" + qr.terminal(quiet_zone=1))
        return True
    except ImportError:
        print_warning("pyqrcode ei ole asennettu, QR-koodi ei saatavilla")
        print_info("Asenna: pip install pyqrcode pypng")
        return False

def start_expo_dev_server(tunnel=False):
    """Käynnistää Expo dev-serverin"""
    print(f"\n{Colors.BOLD}Käynnistetään Expo dev-serveri...{Colors.END}")
    
    cmd = ["npx", "expo", "start"]
    if tunnel:
        cmd.append("--tunnel")
        print_info("Käynnistetään tunnel-tilassa")
    
    print_info(f"Suoritetaan: {' '.join(cmd)}")
    print_info("Paina Ctrl+C lopettaaksesi\n")
    
    try:
        # Käynnistä Expo prosessi
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True
        )
        
        qr_code_shown = False
        
        # Lue output reaaliajassa
        for line in iter(process.stdout.readline, ''):
            if line:
                print(line, end='')
                
                # Etsi QR-koodin URL
                if not qr_code_shown and "exp://" in line:
                    # Yritä löytää URL ja generoida QR-koodi
                    match = re.search(r'(exp://[^\s]+)', line)
                    if match:
                        url = match.group(1)
                        generate_qr_code(url)
                        qr_code_shown = True
        
        process.wait()
        
    except KeyboardInterrupt:
        print_info("\n\nExpo dev-serveri pysäytetty")
        if process:
            process.terminate()
            process.wait()
    except Exception as e:
        print_error(f"Virhe Expo-serverin käynnistyksessä: {e}")
        return False
    
    return True

def show_menu():
    """Näyttää päävalikon"""
    print(f"\n{Colors.BOLD}Valitse toiminto:{Colors.END}\n")
    print(f"  {Colors.CYAN}1){Colors.END} Full guided install and start (oletus)")
    print(f"     → Tarkistaa työkalut, asentaa riippuvuudet, käynnistää Expo serverin")
    print()
    print(f"  {Colors.CYAN}2){Colors.END} Quick start (no input)")
    print(f"     → Käynnistää Expo serverin suoraan (--tunnel)")
    print()
    print(f"  {Colors.CYAN}3){Colors.END} Install dependencies only")
    print(f"     → Asentaa vain npm riippuvuudet")
    print()
    print(f"  {Colors.CYAN}4){Colors.END} Exit")
    print(f"     → Poistu ohjelmasta")
    print()

def get_user_choice():
    """Kysyy käyttäjän valintaa"""
    while True:
        try:
            choice = input(f"{Colors.BOLD}Valintasi (1-4) [1]: {Colors.END}").strip()
            
            # Oletus on 1
            if not choice:
                choice = "1"
            
            if choice in ["1", "2", "3", "4"]:
                return choice
            else:
                print_error("Virheellinen valinta. Valitse 1-4.")
        except (KeyboardInterrupt, EOFError):
            print("\n")
            return "4"

def option_full_guided_install():
    """Vaihtoehto 1: Full guided install and start"""
    print(f"\n{Colors.BOLD}{Colors.GREEN}=== FULL GUIDED INSTALL AND START ==={Colors.END}\n")
    
    # 1. Tarkista Node.js ja npm
    if not check_node_npm():
        print_error("\nNode.js tai npm puuttuu. Asenna ne ensin.")
        return False
    
    # 2. Tarkista package.json engines
    check_package_json_engines()
    
    # 3. Asenna riippuvuudet
    if not install_dependencies():
        print_error("\nRiippuvuuksien asennus epäonnistui")
        return False
    
    # 4. Tarkista Expo kirjautuminen
    check_expo_login()
    
    # 5. Yritä käynnistää backend (jos löytyy)
    start_backend()
    
    # 6. Käynnistä Expo dev-serveri
    print_success("\nValmista! Käynnistetään Expo dev-serveri...")
    time.sleep(1)
    start_expo_dev_server(tunnel=False)
    
    return True

def option_quick_start():
    """Vaihtoehto 2: Quick start"""
    print(f"\n{Colors.BOLD}{Colors.GREEN}=== QUICK START ==={Colors.END}\n")
    
    print_info("Käynnistetään Expo dev-serveri tunnel-tilassa...")
    print_info("Oletetaan että riippuvuudet on jo asennettu")
    time.sleep(1)
    
    start_expo_dev_server(tunnel=True)
    return True

def option_install_only():
    """Vaihtoehto 3: Install dependencies only"""
    print(f"\n{Colors.BOLD}{Colors.GREEN}=== INSTALL DEPENDENCIES ONLY ==={Colors.END}\n")
    
    # 1. Tarkista Node.js ja npm
    if not check_node_npm():
        print_error("\nNode.js tai npm puuttuu. Asenna ne ensin.")
        return False
    
    # 2. Tarkista package.json engines
    check_package_json_engines()
    
    # 3. Asenna riippuvuudet
    if not install_dependencies():
        print_error("\nRiippuvuuksien asennus epäonnistui")
        return False
    
    print_success("\n✓ Riippuvuudet asennettu!")
    print_info("\nVoit nyt käynnistää sovelluksen komennolla:")
    print(f"  {Colors.CYAN}npm start{Colors.END}")
    print(f"tai:")
    print(f"  {Colors.CYAN}python3 install.py --quick{Colors.END}")
    
    return True

def main():
    """Pääohjelma"""
    # Parse command line arguments
    parser = argparse.ArgumentParser(
        description="Yritystili käyttöönotto-assistentti",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Esimerkkejä:
  python3 install.py              # Interaktiivinen valikko
  python3 install.py --auto       # Automaattinen asennus ja käynnistys
  python3 install.py --quick      # Nopea käynnistys
  python3 install.py --install-only  # Asenna vain riippuvuudet
        """
    )
    
    parser.add_argument(
        '--auto',
        action='store_true',
        help='Suorita vaihtoehto 1 automaattisesti (Full guided install)'
    )
    
    parser.add_argument(
        '--quick',
        action='store_true',
        help='Suorita vaihtoehto 2 automaattisesti (Quick start)'
    )
    
    parser.add_argument(
        '--install-only',
        action='store_true',
        help='Suorita vaihtoehto 3 automaattisesti (Install dependencies only)'
    )
    
    args = parser.parse_args()
    
    # Näytä banneri
    print_banner()
    
    # Tarkista onko lippuja annettu
    if args.auto:
        print_info("Suoritetaan automaattinen asennus (--auto)")
        option_full_guided_install()
        return
    
    if args.quick:
        print_info("Suoritetaan nopea käynnistys (--quick)")
        option_quick_start()
        return
    
    if args.install_only:
        print_info("Asennetaan vain riippuvuudet (--install-only)")
        option_install_only()
        return
    
    # Interaktiivinen valikko
    while True:
        show_menu()
        choice = get_user_choice()
        
        if choice == "1":
            option_full_guided_install()
            break
        elif choice == "2":
            option_quick_start()
            break
        elif choice == "3":
            option_install_only()
            break
        elif choice == "4":
            print_info("Poistutaan...")
            sys.exit(0)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Ohjelma keskeytetty käyttäjän toimesta{Colors.END}")
        sys.exit(0)
    except Exception as e:
        print_error(f"\nOdottamaton virhe: {e}")
        sys.exit(1)
