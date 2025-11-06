#!/usr/bin/env python3
"""
Installation script for mobilebanks Expo app.
Handles dependency installation, engine checks, and development server startup.
Fixed for Windows compatibility - normalizes subprocess calls for .cmd/.bat files.
"""

import os
import sys
import subprocess
import json
import argparse
from typing import List, Tuple, Union, Optional


def normalize_cmd(cmd: Union[List[str], Tuple[str, ...], str]) -> Tuple[Union[List[str], str], bool]:
    """
    Normalize command for subprocess execution, handling Windows .cmd/.bat files.
    
    Args:
        cmd: Command as list, tuple, or string
        
    Returns:
        Tuple of (command_for_subprocess, shell_flag)
        - On Windows (os.name == 'nt'), converts list/tuple to string and sets shell=True
        - On Unix/Linux/Mac, keeps list format and sets shell=False
    """
    if os.name == 'nt':
        # Windows: convert to string and use shell=True for .cmd/.bat compatibility
        if isinstance(cmd, (list, tuple)):
            cmd_str = ' '.join(cmd)
            print(f"[Windows] Normalisoidaan komento: {cmd_str}")
            return (cmd_str, True)
        return (cmd, True)
    else:
        # Unix/Linux/Mac: keep as list, use shell=False
        if isinstance(cmd, str):
            return (cmd.split(), False)
        return (cmd, False)


def run(cmd: Union[List[str], str], check: bool = True, capture_output: bool = False, 
        text: bool = True) -> subprocess.CompletedProcess:
    """
    Execute a command using subprocess.run with Windows compatibility.
    
    Args:
        cmd: Command to execute (list or string)
        check: Whether to raise exception on non-zero exit
        capture_output: Whether to capture stdout/stderr
        text: Whether to decode output as text
        
    Returns:
        CompletedProcess instance
    """
    normalized_cmd, shell_flag = normalize_cmd(cmd)
    
    return subprocess.run(
        normalized_cmd,
        check=check,
        capture_output=capture_output,
        text=text,
        shell=shell_flag
    )


def popen(cmd: Union[List[str], str], **kwargs) -> subprocess.Popen:
    """
    Create a subprocess.Popen instance with Windows compatibility.
    
    Args:
        cmd: Command to execute (list or string)
        **kwargs: Additional arguments to pass to Popen
        
    Returns:
        Popen instance
    """
    normalized_cmd, shell_flag = normalize_cmd(cmd)
    
    # Set default kwargs if not provided
    if 'text' not in kwargs and 'universal_newlines' not in kwargs:
        kwargs['text'] = True
    if 'stdout' not in kwargs:
        kwargs['stdout'] = subprocess.PIPE
    
    # Override shell with our normalized value
    kwargs['shell'] = shell_flag
    
    return subprocess.Popen(normalized_cmd, **kwargs)


def check_node_version() -> bool:
    """Check if Node.js is installed and get version."""
    try:
        result = run(['node', '--version'], capture_output=True)
        version = result.stdout.strip()
        print(f"✓ Node.js löydetty: {version}")
        
        # Extract major version (e.g., "v18.17.0" -> 18)
        major_version = int(version.lstrip('v').split('.')[0])
        if major_version < 18:
            print(f"⚠ Varoitus: Node.js {major_version} löydetty, suositus: 18+")
            return False
        return True
    except (subprocess.CalledProcessError, FileNotFoundError, ValueError) as e:
        print(f"✗ Node.js ei löytynyt tai virhe: {e}")
        print("  Asenna Node.js 18+ osoitteesta: https://nodejs.org/")
        return False


def check_npm_version() -> bool:
    """Check if npm is installed and get version."""
    try:
        result = run(['npm', '--version'], capture_output=True)
        version = result.stdout.strip()
        print(f"✓ npm löydetty: {version}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"✗ npm ei löytynyt tai virhe: {e}")
        return False


def check_engines() -> bool:
    """Check if required Node.js and npm versions are installed."""
    print("\n=== Tarkistetaan engines ===")
    node_ok = check_node_version()
    npm_ok = check_npm_version()
    
    if node_ok and npm_ok:
        print("✓ Kaikki engines OK\n")
        return True
    else:
        print("✗ Engine-tarkistus epäonnistui\n")
        return False


def install_dependencies() -> bool:
    """Install npm dependencies using npm ci or npm install."""
    print("=== Asennetaan riippuvuudet ===")
    
    # Check if package-lock.json exists
    lock_file = 'package-lock.json'
    if os.path.exists(lock_file):
        print("package-lock.json löydetty, käytetään 'npm ci'")
        cmd = ['npm', 'ci']
    else:
        print("package-lock.json ei löydy, käytetään 'npm install'")
        cmd = ['npm', 'install']
    
    try:
        print(f"Suoritetaan: {' '.join(cmd)}")
        run(cmd)
        print("✓ Riippuvuudet asennettu onnistuneesti\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Riippuvuuksien asennus epäonnistui: {e}\n")
        return False


def expo_login() -> bool:
    """Handle Expo login (optional)."""
    print("=== Expo Login (valinnainen) ===")
    
    response = input("Haluatko kirjautua Expo-tilille? (k/e): ").lower()
    if response == 'k':
        try:
            cmd = ['npx', 'expo', 'login']
            print(f"Suoritetaan: {' '.join(cmd)}")
            run(cmd)
            print("✓ Expo login suoritettu\n")
            return True
        except subprocess.CalledProcessError as e:
            print(f"⚠ Expo login epäonnistui: {e}\n")
            return False
    else:
        print("Ohitetaan Expo login\n")
        return True


def generate_qr_code() -> Optional[str]:
    """Generate QR code for the Expo app (placeholder - real implementation would generate actual QR)."""
    print("=== QR-koodin luonti ===")
    print("QR-koodi luodaan kun käynnistät development serverin")
    print("Voit skannata sen Expo Go -sovelluksella\n")
    return None


def start_dev_server(auto: bool = False) -> None:
    """Start the Expo development server."""
    print("=== Käynnistetään development server ===")
    
    if not auto:
        response = input("Käynnistetäänkö development server? (k/e): ").lower()
        if response != 'k':
            print("Development server -käynnistys ohitettu")
            return
    
    try:
        cmd = ['npm', 'run', 'start']
        print(f"Suoritetaan: {' '.join(cmd)}")
        print("Paina Ctrl+C lopettaaksesi\n")
        
        # Use popen for interactive server process
        process = popen(cmd, stdout=None, stderr=None)
        process.wait()
        
    except KeyboardInterrupt:
        print("\n\nDevelopment server pysäytetty")
    except subprocess.CalledProcessError as e:
        print(f"✗ Development server -käynnistys epäonnistui: {e}")


def main():
    """Main installation flow."""
    parser = argparse.ArgumentParser(
        description='Install and setup mobilebanks Expo app'
    )
    parser.add_argument(
        '--install-only',
        action='store_true',
        help='Asenna vain riippuvuudet, älä käynnistä serveriä'
    )
    parser.add_argument(
        '--auto',
        action='store_true',
        help='Automaattinen tila: ohita vuorovaikutteiset kyselyt'
    )
    
    args = parser.parse_args()
    
    print("\n" + "="*60)
    print("  Mobilebanks Installation Script")
    print("  Windows-yhteensopiva versio")
    print("="*60 + "\n")
    
    # Step 1: Check engines
    if not check_engines():
        print("✗ Engine-tarkistus epäonnistui. Korjaa ongelmat ja yritä uudelleen.")
        sys.exit(1)
    
    # Step 2: Install dependencies
    if not install_dependencies():
        print("✗ Riippuvuuksien asennus epäonnistui.")
        sys.exit(1)
    
    # Step 3: Expo login (optional, only if not install-only)
    if not args.install_only:
        if not args.auto:
            expo_login()
        else:
            print("=== Expo Login ===")
            print("Ohitetaan automaattisessa tilassa\n")
    
    # Step 4: Generate QR code info
    if not args.install_only:
        generate_qr_code()
    
    # Step 5: Start dev server (unless install-only)
    if args.install_only:
        print("\n" + "="*60)
        print("✓ Asennus valmis!")
        print("Käynnistä development server komennolla: npm start")
        print("="*60 + "\n")
    else:
        start_dev_server(auto=args.auto)


if __name__ == '__main__':
    main()
