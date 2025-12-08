#!/usr/bin/env python3
"""
Demo script to show what the launcher looks like
This creates a visual demonstration of the menu
"""

import sys
import os

# Temporarily mock the web directory check for demo
sys.path.insert(0, os.path.dirname(__file__))

from launch_web_server import Colors, print_banner, show_menu, print_color

def demo():
    """Run a demonstration of the launcher"""
    print_banner()
    
    print_color("This is a demonstration of the launcher interface.", Colors.YELLOW)
    print_color("In real usage, you would select an option to start the server.\n", Colors.YELLOW)
    
    # Show what the menu looks like
    print_color("🎯 Choose how to access the application:", Colors.BOLD)
    print()
    print_color("  1️⃣  Local network only (localhost)", Colors.CYAN)
    print_color("      • Fast and simple", Colors.BLUE)
    print_color("      • Access from this computer or local network", Colors.BLUE)
    print_color("      • No internet required", Colors.BLUE)
    print()
    print_color("  2️⃣  Public internet (with ngrok)", Colors.CYAN)
    print_color("      • Access from anywhere on the internet", Colors.BLUE)
    print_color("      • Share with others easily", Colors.BLUE)
    print_color("      • Requires ngrok account (free)", Colors.BLUE)
    print()
    print_color("  3️⃣  Exit", Colors.CYAN)
    print()
    
    print_color("\n" + "="*60, Colors.CYAN)
    print_color("Demo complete! This shows the interactive menu interface.", Colors.GREEN)
    print_color("="*60, Colors.CYAN)
    print()
    
    print_color("Available launch methods:", Colors.BOLD)
    print_color("  • Launch_Web_Server.bat (Windows)", Colors.CYAN)
    print_color("  • python launch_web_server.py (Any OS)", Colors.CYAN)
    print_color("  • python launch_web_server.py --local (Direct local)", Colors.CYAN)
    print_color("  • python launch_web_server.py --ngrok (Direct ngrok)", Colors.CYAN)
    print()

if __name__ == "__main__":
    demo()
