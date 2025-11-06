#!/usr/bin/env python3
"""
Installation script for MobileBanks Expo app.
Handles Expo development server startup with automatic port conflict resolution.
"""

import sys
import subprocess
import re


def start_expo_and_show_qr(port=None):
    """
    Start Expo development server and display QR code.
    Automatically handles port conflicts by prompting user when running in interactive mode.
    
    Args:
        port: Optional port number to use. If None, uses Expo's default (8081).
    """
    # Build the command
    cmd = ["npx", "expo", "start", "--tunnel"]
    if port:
        cmd.extend(["--port", str(port)])
    
    print(f"Starting Expo development server{f' on port {port}' if port else ''}...")
    print(f"Command: {' '.join(cmd)}")
    
    process = None  # Initialize to avoid NameError in exception handler
    try:
        # Start Expo process with stdout/stderr pipes to capture output
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            stdin=subprocess.PIPE,
            text=True,
            bufsize=1  # Line buffered
        )
        
        # Pattern to detect port conflict
        port_conflict_pattern = re.compile(r"Port (\d+) is being used by another process")
        port_suggestion_pattern = re.compile(r"Use port (\d+) instead\?")
        input_required_pattern = re.compile(r"Input is required", re.IGNORECASE)
        skipping_dev_server_pattern = re.compile(r"Skipping dev server", re.IGNORECASE)
        
        detected_conflict = False
        current_port = None
        suggested_port = None
        
        # Read output line by line
        for line in iter(process.stdout.readline, ''):
            if not line:
                break
                
            # Print the line to show Expo output
            print(line.rstrip())
            
            # Check for port conflict
            port_match = port_conflict_pattern.search(line)
            if port_match:
                current_port = port_match.group(1)
                detected_conflict = True
                print(f"\n⚠️  Port conflict detected: Port {current_port} is already in use")
            
            # Check for port suggestion
            suggestion_match = port_suggestion_pattern.search(line)
            if suggestion_match and detected_conflict:
                suggested_port = suggestion_match.group(1)
                print(f"💡 Expo suggests using port {suggested_port} instead")
                
                # If we're in non-interactive mode and Expo is piped, 
                # it will likely fail soon, so we should prepare to handle it
                if not sys.stdin.isatty():
                    print(f"🤖 Non-interactive mode detected.")
            
            # Check for input required message or skipping dev server
            if (input_required_pattern.search(line) or skipping_dev_server_pattern.search(line)) and detected_conflict and suggested_port:
                # Handle the port conflict
                if sys.stdin.isatty():
                    # Interactive mode: ask user
                    print(f"\n❓ Port {current_port} is in use.")
                    response = input(f"   Do you want to use port {suggested_port} instead? (y/n): ").strip().lower()
                    
                    if response in ('y', 'yes'):
                        print(f"✅ Restarting Expo on port {suggested_port}...")
                        
                        # Kill the current process
                        process.terminate()
                        try:
                            process.wait(timeout=5)
                        except subprocess.TimeoutExpired:
                            process.kill()
                            process.wait()
                        
                        # Restart with the new port
                        return start_expo_and_show_qr(port=int(suggested_port))
                    else:
                        print("❌ User declined to use alternate port. Exiting.")
                        process.terminate()
                        try:
                            process.wait(timeout=5)
                        except subprocess.TimeoutExpired:
                            process.kill()
                            process.wait()
                        return 1
                else:
                    # Non-interactive mode: automatically use suggested port
                    print(f"🤖 Non-interactive mode detected. Automatically using port {suggested_port}...")
                    
                    # Kill the current process
                    process.terminate()
                    try:
                        process.wait(timeout=5)
                    except subprocess.TimeoutExpired:
                        process.kill()
                        process.wait()
                    
                    # Restart with the new port
                    return start_expo_and_show_qr(port=int(suggested_port))
        
        # Wait for the process to complete
        return_code = process.wait()
        
        # If we detected a port conflict and have a suggested port, but the process exited
        # (likely because it was in non-interactive mode), restart with the suggested port
        if detected_conflict and suggested_port and return_code != 0:
            print(f"\n⚠️  Expo exited with code {return_code} due to port conflict.")
            print(f"🔄 Automatically restarting on port {suggested_port}...")
            return start_expo_and_show_qr(port=int(suggested_port))
        
        return return_code
        
    except KeyboardInterrupt:
        print("\n\n🛑 Interrupted by user. Shutting down...")
        if process:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()
        return 130
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return 1


def main():
    """Main entry point for the installation script."""
    print("=" * 60)
    print("MobileBanks - Expo Development Server")
    print("=" * 60)
    print()
    
    # Check if Node.js is installed
    try:
        result = subprocess.run(
            ["node", "--version"],
            capture_output=True,
            text=True,
            check=True
        )
        print(f"✅ Node.js version: {result.stdout.strip()}")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Error: Node.js is not installed or not in PATH")
        print("   Please install Node.js from https://nodejs.org/")
        return 1
    
    # Check if npm is installed
    try:
        result = subprocess.run(
            ["npm", "--version"],
            capture_output=True,
            text=True,
            check=True
        )
        print(f"✅ npm version: {result.stdout.strip()}")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Error: npm is not installed or not in PATH")
        return 1
    
    print()
    print("Starting Expo development server with tunnel mode...")
    print("This will allow you to access the app from anywhere using Expo Go.")
    print()
    
    # Start Expo
    return start_expo_and_show_qr()


if __name__ == "__main__":
    sys.exit(main())
