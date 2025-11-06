#!/usr/bin/env python3
"""
install.py

Tekstipohjainen asennus- ja käynnistysskripti Expo/Node -projektille.

Parannus (Windows):
- normalize_cmd(cmd) palauttaa (cmd_for_subprocess, shell_flag)
  jolloin Windowsissa (.cmd/.bat) lista muutetaan merkkijonoksi ja shell=True.
- popen() käyttää normalize_cmd:ia ja palauttaa subprocess.Popen-instanssin.
- run() käyttää normalize_cmd:ia.
"""
from __future__ import annotations
import os
import sys
import json
import shutil
import subprocess
import re
import time
import argparse
from pathlib import Path
from typing import Optional, Tuple, Union

ROOT = Path.cwd()

def echo(msg: str = ""):
    print(msg)
    sys.stdout.flush()

def normalize_cmd(cmd: Union[str, list, tuple]) -> Tuple[Union[str, list], bool]:
    """
    Normalisoi komennon suoritettavaksi muotoon.
    Windowsissa lista muutetaan merkkijonoksi ja shell=True,
    jotta npm/npx (.cmd) löytyvät.
    
    Returns:
        (cmd_for_subprocess, shell_flag)
    """
    is_windows = os.name == "nt"
    if is_windows:
        if isinstance(cmd, (list, tuple)):
            return (" ".join(cmd), True)
        else:
            return (cmd, True)
    else:
        if isinstance(cmd, (list, tuple)):
            return (list(cmd), False)
        else:
            return (cmd, True)

def run(cmd: Union[str, list, tuple], capture: bool = False, check: bool = False, 
        env: Optional[dict] = None, shell: Optional[bool] = None, text: bool = True):
    """
    Suorittaa komennon käyttäen normalize_cmd:ia.
    
    Args:
        cmd: Komento (lista tai merkkijono)
        capture: Jos True, palauttaa stdout
        check: Jos True, nostaa CalledProcessError epäonnistuessa
        env: Ympäristömuuttujat
        shell: Jos annettu, override normalize_cmd:n shell-flag
        text: Jos True, käyttää text=True (str output)
    
    Returns:
        (returncode, stdout_or_None)
    """
    cmd_for_subproc, shell_flag = normalize_cmd(cmd)
    if shell is not None:
        shell_flag = shell
    
    if isinstance(cmd, (list, tuple)):
        cmd_display = " ".join(cmd)
    else:
        cmd_display = str(cmd)
    echo(f"$ {cmd_display}")

    try:
        if capture:
            res = subprocess.run(
                cmd_for_subproc, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.STDOUT, 
                env=env, 
                shell=shell_flag, 
                check=check, 
                text=text
            )
            return res.returncode, res.stdout
        else:
            res = subprocess.run(cmd_for_subproc, env=env, shell=shell_flag)
            return res.returncode, None
    except subprocess.CalledProcessError as e:
        return e.returncode, getattr(e, "output", None)
    except FileNotFoundError as e:
        echo(f"\n! Komentoa ei löydy: {e}")
        return 2, None

def popen(cmd: Union[str, list, tuple], env: Optional[dict] = None, 
          stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text: bool = True):
    """
    Käynnistää prosessin käyttäen normalize_cmd:ia.
    Palauttaa subprocess.Popen-instanssin.
    """
    cmd_for_subproc, shell_flag = normalize_cmd(cmd)
    return subprocess.Popen(
        cmd_for_subproc, 
        stdout=stdout, 
        stderr=stderr, 
        env=env, 
        shell=shell_flag, 
        text=text
    )

def check_program(prog: str) -> bool:
    """Tarkistaa onko ohjelma saatavilla"""
    return shutil.which(prog) is not None

def read_json(path: Path) -> Optional[dict]:
    """Lukee JSON-tiedoston"""
    if not path.exists():
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        echo(f"! Virhe JSON:n lukemisessa {path}: {e}")
        return None

def parse_simple_version(version_str: str) -> tuple:
    """Parsii version (X.Y.Z) tupleksi"""
    match = re.search(r"(\d+)\.(\d+)\.(\d+)", version_str)
    if match:
        return (int(match.group(1)), int(match.group(2)), int(match.group(3)))
    return (0, 0, 0)

def compare_major(installed_ver: str, required: str) -> bool:
    """Vertaa major-versioita"""
    inst = parse_simple_version(installed_ver)
    req_match = re.search(r"(\d+)", required)
    if not req_match:
        return True
    req_major = int(req_match.group(1))
    return inst[0] >= req_major

def ensure_python_package(package_name: str) -> bool:
    """Varmistaa että Python-paketti on asennettu"""
    try:
        __import__(package_name)
        return True
    except ImportError:
        echo(f"- Asennetaan Python-paketti: {package_name}")
        code, _ = run([sys.executable, "-m", "pip", "install", package_name], capture=True)
        return code == 0

def install_node_dependencies():
    """
    Asentaa node-riippuvuudet.
    Yrittää järjestyksessä: npm ci, npm install, yarn install.
    """
    echo("\n=== Asennetaan riippuvuudet ===")
    
    pkg_json = ROOT / "package.json"
    if not pkg_json.exists():
        echo("! package.json ei löydy, ohitetaan riippuvuuksien asennus")
        return False
    
    # Tarkista package-lock.json
    has_lock = (ROOT / "package-lock.json").exists()
    has_yarn = (ROOT / "yarn.lock").exists()
    
    if has_lock and check_program("npm"):
        echo("- Löytyi package-lock.json, ajetaan 'npm ci'")
        code, out = run(["npm", "ci"], capture=True)
        if code == 0:
            echo("✓ npm ci onnistui")
            return True
        else:
            echo("! npm ci epäonnistui, yritetään npm install")
    
    if check_program("npm"):
        echo("- Ajetaan 'npm install'")
        code, out = run(["npm", "install"], capture=True)
        if code == 0:
            echo("✓ npm install onnistui")
            return True
        else:
            echo("! npm install epäonnistui")
            return False
    
    if has_yarn and check_program("yarn"):
        echo("- Ajetaan 'yarn install'")
        code, out = run(["yarn", "install"], capture=True)
        if code == 0:
            echo("✓ yarn install onnistui")
            return True
    
    echo("! Riippuvuuksien asennus epäonnistui")
    return False

def expo_whoami() -> Optional[str]:
    """Tarkistaa Expo kirjautumisen"""
    if not check_program("npx"):
        return None
    code, out = run(["npx", "expo", "whoami"], capture=True)
    if code != 0 or not out:
        return None
    out = out.strip()
    if "Not logged in" in out or "not authenticated" in out.lower():
        return None
    return out

def expo_login_interactive():
    """Kirjautuu Expoon interaktiivisesti"""
    echo("\n=== Expo kirjautuminen ===")
    
    # Tarkista EXPO_TOKEN
    if os.environ.get("EXPO_TOKEN"):
        echo("✓ EXPO_TOKEN löytyi ympäristömuuttujista")
        return True
    
    # Tarkista onko jo kirjautunut
    username = expo_whoami()
    if username:
        echo(f"✓ Olet jo kirjautunut Expoon: {username}")
        return True
    
    echo("- Et ole kirjautunut Expoon")
    echo("- Voit kirjautua nyt tai ohittaa (ei pakollinen)")
    
    try:
        ans = input("Haluatko kirjautua Expoon? (k/e) [e]: ").strip().lower()
    except (KeyboardInterrupt, EOFError):
        ans = "e"
    
    if ans == "k":
        echo("- Suoritetaan 'npx expo login'")
        code, _ = run(["npx", "expo", "login"])
        if code == 0:
            echo("✓ Kirjautuminen onnistui")
            return True
        else:
            echo("! Kirjautuminen epäonnistui")
            return False
    else:
        echo("- Ohitetaan Expo-kirjautuminen")
        return True

def start_backend_if_found():
    """
    Käynnistää backendin jos löytyy backend/server/api -hakemisto.
    Palauttaa Popen-olion tai None.
    """
    echo("\n=== Tarkistetaan backend ===")
    
    for dirname in ["backend", "server", "api"]:
        backend_dir = ROOT / dirname
        if backend_dir.exists() and backend_dir.is_dir():
            echo(f"- Löytyi backend-hakemisto: {dirname}")
            
            # Tarkista package.json
            pkg = backend_dir / "package.json"
            if pkg.exists():
                data = read_json(pkg)
                if data and "scripts" in data and "start" in data["scripts"]:
                    echo(f"- Käynnistetään backend: npm run start (hakemistossa {dirname})")
                    proc = popen(["npm", "run", "start"], env=os.environ.copy())
                    time.sleep(2)
                    echo("✓ Backend käynnistetty taustalla")
                    return proc
            
            # Etsi entry point (index.js, server.js, app.js)
            for entry in ["index.js", "server.js", "app.js"]:
                entry_path = backend_dir / entry
                if entry_path.exists():
                    echo(f"- Käynnistetään backend: node {entry}")
                    proc = popen(["node", str(entry_path)], env=os.environ.copy())
                    time.sleep(2)
                    echo("✓ Backend käynnistetty taustalla")
                    return proc
    
    echo("- Backend-hakemistoa ei löytynyt, ohitetaan")
    return None

def find_expo_url_from_line(line: str) -> Optional[str]:
    """Etsii exp:// URL:n riviltä"""
    match = re.search(r"(exp://[\d\.]+:\d+)", line)
    if match:
        return match.group(1)
    return None

def start_expo_and_show_qr(interactive: bool = True, max_retries: int = 3) -> Optional[subprocess.Popen]:
    """
    Käynnistää Expo dev-serverin ja näyttää QR-koodin.
    
    Käsittelee "Port X is being used" -viestit:
    - Jos interaktiivinen, kysyy käyttäjältä hyväksyntää
    - Jos ei-interaktiivinen, yrittää automaattisesti uudelleen
    
    Args:
        interactive: Jos True, kysyy käyttäjältä vahvistusta porttivaihdolle
        max_retries: Maksimi yritysten määrä porttien kanssa
    
    Returns:
        Popen-olio tai None
    """
    echo("\n=== Käynnistetään Expo ===")
    
    # Varmista pyqrcode ja pypng
    ensure_python_package("pyqrcode")
    ensure_python_package("pypng")
    
    port = 8081  # Oletus portti
    attempt = 0
    
    while attempt < max_retries:
        cmd = ["npx", "expo", "start", "--port", str(port)]
        echo(f"- Yritetään käynnistää Expo portilla {port}")
        
        proc = popen(cmd, env=os.environ.copy())
        
        # Lue output hetken aikaa ja etsi porttikonflikti
        qr_url = None
        port_conflict = False
        suggested_port = None
        
        start_time = time.time()
        timeout = 30  # 30 sekuntia timeout
        
        try:
            while time.time() - start_time < timeout:
                line = proc.stdout.readline()
                if not line:
                    # Prosessi on lopettanut
                    break
                
                echo(line.rstrip())
                
                # Tarkista porttikonflikti
                if "is being used" in line.lower() or ("port" in line.lower() and "in use" in line.lower()):
                    port_conflict = True
                    # Yritä löytää ehdotettu portti
                    match = re.search(r"port (\d+)", line, re.IGNORECASE)
                    if match:
                        suggested_port = int(match.group(1))
                
                # Etsi QR URL
                url = find_expo_url_from_line(line)
                if url:
                    qr_url = url
                    break
                
                # Jos näkyvissä "Metro waiting", oletamme että käynnistyi
                if "Metro waiting" in line or "Logs for your project" in line:
                    break
            
            if port_conflict:
                echo(f"\n! Portti {port} on käytössä")
                proc.terminate()
                proc.wait()
                
                if suggested_port:
                    port = suggested_port
                else:
                    port += 1
                
                if interactive:
                    try:
                        ans = input(f"Yritetäänkö portilla {port}? (k/e) [k]: ").strip().lower()
                        if ans == "e":
                            echo("- Käyttäjä keskeytti")
                            return None
                    except (KeyboardInterrupt, EOFError):
                        echo("\n- Keskeytetty")
                        return None
                else:
                    echo(f"- Ei-interaktiivinen tila, yritetään automaattisesti portilla {port}")
                
                attempt += 1
                continue
            
            # Jos löytyi QR URL, näytä se
            if qr_url:
                echo(f"\n✓ Expo käynnistetty: {qr_url}")
                try:
                    import pyqrcode
                    qr = pyqrcode.create(qr_url)
                    echo("\n" + qr.terminal(quiet_zone=1))
                    echo("\n✓ Skannaa QR-koodi Expo Go -sovelluksella\n")
                except ImportError:
                    echo("! pyqrcode ei saatavilla, QR-koodia ei voitu näyttää")
                except Exception as e:
                    echo(f"! QR-koodin luonti epäonnistui: {e}")
            
            return proc
        
        except KeyboardInterrupt:
            echo("\n- Keskeytetty käyttäjän toimesta")
            proc.terminate()
            proc.wait()
            return None
    
    echo(f"\n! Expo-käynnistys epäonnistui {max_retries} yrityksen jälkeen")
    return None

def guided_full_flow():
    """
    Vaihtoehto 1: Full guided install and start
    """
    echo("\n" + "="*60)
    echo("  FULL GUIDED INSTALL AND START")
    echo("="*60 + "\n")
    
    # 1. Tarkista Node ja npm
    echo("=== Tarkistetaan Node.js ja npm ===")
    if not check_program("node"):
        echo("! Node.js ei löydy. Asenna se: https://nodejs.org/")
        return False
    
    code, node_ver = run(["node", "--version"], capture=True)
    if code == 0 and node_ver:
        echo(f"✓ Node.js: {node_ver.strip()}")
    
    if not check_program("npm"):
        echo("! npm ei löydy")
        return False
    
    code, npm_ver = run(["npm", "--version"], capture=True)
    if code == 0 and npm_ver:
        echo(f"✓ npm: {npm_ver.strip()}")
    
    # 2. Tarkista package.json engines
    pkg_json = ROOT / "package.json"
    if pkg_json.exists():
        data = read_json(pkg_json)
        if data and "engines" in data:
            engines = data["engines"]
            echo("\n=== package.json engines ===")
            for key, val in engines.items():
                echo(f"  {key}: {val}")
            
            # Vertaa Node-versiota
            if "node" in engines and node_ver:
                required = engines["node"]
                if not compare_major(node_ver.strip(), required):
                    echo(f"! VAROITUS: Node-versio saattaa olla liian vanha (vaaditaan {required})")
                else:
                    echo(f"✓ Node-versio täyttää vaatimukset")
    
    # 3. Asenna riippuvuudet
    if not install_node_dependencies():
        echo("\n! Riippuvuuksien asennus epäonnistui")
        return False
    
    # 4. Expo kirjautuminen
    expo_login_interactive()
    
    # 5. Backend
    backend_proc = start_backend_if_found()
    
    # 6. Expo
    expo_proc = start_expo_and_show_qr(interactive=True)
    if not expo_proc:
        echo("! Expo-käynnistys epäonnistui")
        if backend_proc:
            backend_proc.terminate()
        return False
    
    echo("\n✓ Kaikki valmista! Sovellus käynnissä.")
    echo("  Paina Ctrl+C lopettaaksesi\n")
    
    try:
        expo_proc.wait()
    except KeyboardInterrupt:
        echo("\n- Pysäytetään sovellus...")
        expo_proc.terminate()
        if backend_proc:
            backend_proc.terminate()
    
    return True

def quick_start():
    """
    Vaihtoehto 2: Quick start (no input)
    """
    echo("\n" + "="*60)
    echo("  QUICK START")
    echo("="*60 + "\n")
    
    echo("- Oletetaan että riippuvuudet on asennettu")
    echo("- Käynnistetään Expo ei-interaktiivisesti\n")
    
    expo_proc = start_expo_and_show_qr(interactive=False)
    if not expo_proc:
        echo("! Expo-käynnistys epäonnistui")
        return False
    
    echo("\n✓ Sovellus käynnissä (quick start)")
    echo("  Paina Ctrl+C lopettaaksesi\n")
    
    try:
        expo_proc.wait()
    except KeyboardInterrupt:
        echo("\n- Pysäytetään sovellus...")
        expo_proc.terminate()
    
    return True

def install_only():
    """
    Vaihtoehto 3: Install dependencies only
    """
    echo("\n" + "="*60)
    echo("  INSTALL DEPENDENCIES ONLY")
    echo("="*60 + "\n")
    
    # Tarkista Node ja npm
    echo("=== Tarkistetaan Node.js ja npm ===")
    if not check_program("node"):
        echo("! Node.js ei löydy. Asenna se: https://nodejs.org/")
        return False
    
    code, node_ver = run(["node", "--version"], capture=True)
    if code == 0 and node_ver:
        echo(f"✓ Node.js: {node_ver.strip()}")
    
    if not check_program("npm"):
        echo("! npm ei löydy")
        return False
    
    code, npm_ver = run(["npm", "--version"], capture=True)
    if code == 0 and npm_ver:
        echo(f"✓ npm: {npm_ver.strip()}")
    
    # Asenna riippuvuudet
    if not install_node_dependencies():
        echo("\n! Riippuvuuksien asennus epäonnistui")
        return False
    
    echo("\n✓ Riippuvuudet asennettu onnistuneesti!")
    echo("\nVoit nyt käynnistää sovelluksen:")
    echo("  npm start")
    echo("tai:")
    echo("  python3 install.py --quick\n")
    
    return True

def show_menu():
    """Näyttää tekstipohjaisen valikon"""
    echo("\n" + "="*60)
    echo("  TEKSTIPOHJAINEN VALIKKO")
    echo("="*60 + "\n")
    echo("Valitse toiminto:\n")
    echo("  1) Full guided install and start (oletus)")
    echo("     Asentaa riippuvuudet, käynnistää backendin ja Expon\n")
    echo("  2) Quick start (no input)")
    echo("     Käynnistää Expon suoraan (olettaa riippuvuudet asennetuksi)\n")
    echo("  3) Install dependencies only")
    echo("     Asentaa vain node-riippuvuudet\n")
    echo("  4) Exit")
    echo("     Poistu ohjelmasta\n")

def parse_args():
    """Parsii komentoriviargumentit"""
    parser = argparse.ArgumentParser(
        description="Tekstipohjainen asennus- ja käynnistysskripti",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--auto",
        action="store_true",
        help="Automaattinen full guided install and start (vaihtoehto 1)"
    )
    parser.add_argument(
        "--quick",
        action="store_true",
        help="Quick start (vaihtoehto 2)"
    )
    parser.add_argument(
        "--install-only",
        action="store_true",
        help="Install dependencies only (vaihtoehto 3)"
    )
    return parser.parse_args()

def main():
    """Pääohjelma"""
    args = parse_args()
    
    echo("\n" + "="*60)
    echo("  Yritystili – Helsinki eBike Service Oy")
    echo("  Käyttöönotto-assistentti")
    echo("="*60)
    
    # Jos annettu lippuja, suorita suoraan
    if args.auto:
        echo("\n[--auto] Suoritetaan full guided install")
        return guided_full_flow()
    
    if args.quick:
        echo("\n[--quick] Suoritetaan quick start")
        return quick_start()
    
    if args.install_only:
        echo("\n[--install-only] Asennetaan vain riippuvuudet")
        return install_only()
    
    # Muuten näytä valikko
    while True:
        show_menu()
        
        try:
            choice = input("Valintasi (1-4) [1]: ").strip()
        except (KeyboardInterrupt, EOFError):
            echo("\n\n- Ohjelma keskeytetty")
            return False
        
        if not choice:
            choice = "1"
        
        if choice == "1":
            return guided_full_flow()
        elif choice == "2":
            return quick_start()
        elif choice == "3":
            return install_only()
        elif choice == "4":
            echo("\n- Poistutaan...")
            return True
        else:
            echo("\n! Virheellinen valinta, valitse 1-4\n")

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        echo("\n\n- Ohjelma keskeytetty käyttäjän toimesta")
        sys.exit(130)
    except Exception as e:
        echo(f"\n! Odottamaton virhe: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
