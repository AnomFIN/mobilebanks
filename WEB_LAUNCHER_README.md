# Web Server Launcher for MobileBanks

This guide explains how to launch the MobileBanks web application using the provided launcher scripts.

## 🚀 Quick Start

### Option 1: Double-Click (Windows)

1. **Double-click** `Launch_Web_Server.bat`
2. Choose your preferred access method:
   - **Local network only** - Access from your computer or local network
   - **Public internet** - Access from anywhere using ngrok
3. Your browser will automatically open the application

### Option 2: Command Line

#### Windows
```bash
python launch_web_server.py
```

#### Linux/Mac
```bash
python3 launch_web_server.py
```

## 📋 Prerequisites

### Required
- **Python 3.6 or higher**
  - Download from: https://www.python.org/downloads/
  - ⚠️ During installation, check "Add Python to PATH"

### Optional (for public access)
- **ngrok** (for internet-accessible hosting)
  - Download from: https://ngrok.com/download
  - Sign up for free account at: https://ngrok.com
  - Authenticate: `ngrok authtoken <your-token>`

## 🎯 Access Methods

### 1. Local Network (Default)
- ✅ No additional setup required
- ✅ Fast and simple
- ✅ Works offline
- 🌐 Access URLs:
  - `http://localhost:8000`
  - `http://<your-ip>:8000` (from other devices on your network)

**Use when:**
- Testing locally
- Accessing from the same computer
- Accessing from devices on your local network

### 2. Public Internet (with ngrok)
- 🌍 Access from anywhere on the internet
- 🔗 Easy sharing with others
- 🔒 HTTPS encryption
- ⚡ Requires active internet connection

**Use when:**
- Sharing with remote users
- Testing on external devices
- Demonstrating to clients

**ngrok URL format:** `https://xxxxx-xx-xxx-xxx-xx.ngrok.io`

## 🖥️ Desktop Shortcut (Windows)

### Automatic Creation
Run the shortcut creator:
```bash
python create_desktop_shortcut.py
```

### Manual Creation
1. Right-click on `Launch_Web_Server.bat`
2. Select "Send to" → "Desktop (create shortcut)"
3. Optionally rename the shortcut

## 🛠️ Troubleshooting

### "Python is not installed or not in PATH"
**Solution:**
1. Install Python from https://www.python.org/downloads/
2. During installation, check "Add Python to PATH"
3. Restart your terminal/command prompt

### "ngrok is not installed"
**Solution:**
1. Download ngrok from https://ngrok.com/download
2. Extract and place `ngrok.exe` in a folder in your PATH
3. Or place it in the same folder as the launcher scripts

**Quick ngrok setup:**
```bash
# After downloading ngrok
ngrok authtoken <your-auth-token>
```

### "web/ directory not found"
**Solution:**
Make sure you're running the script from the project root directory where the `web/` folder exists.

### Port 8000 is already in use
**Solution:**
The script will automatically use port 8000. If it's busy:
1. Stop other servers using that port
2. Or modify the `port` variable in `launch_web_server.py`

## 📱 Accessing from Mobile Devices

### Same WiFi Network (Local)
1. Start the launcher with "Local network" option
2. Find your computer's IP address:
   - **Windows:** `ipconfig` (look for IPv4 Address)
   - **Mac/Linux:** `ifconfig` or `ip addr`
3. On your mobile device, open browser and go to:
   `http://<your-ip>:8000`

### Any Network (ngrok)
1. Start the launcher with "Public internet" option
2. Copy the ngrok URL from the terminal
3. Open that URL on any device, anywhere

## 🎨 Features

- ✅ Interactive menu with colored output
- ✅ Automatic browser opening
- ✅ Easy local and public access
- ✅ Graceful shutdown (Ctrl+C)
- ✅ Error handling and helpful messages
- ✅ Windows .bat file for one-click launch
- ✅ Desktop shortcut creation

## 📚 File Structure

```
mobilebanks/
├── Launch_Web_Server.bat          # Windows launcher (double-click)
├── launch_web_server.py           # Main Python launcher script
├── create_desktop_shortcut.py     # Desktop shortcut creator
├── WEB_LAUNCHER_README.md         # This file
└── web/                           # Web application files
    ├── index.html
    ├── manifest.json
    ├── sw.js
    └── ...
```

## 🔧 Advanced Usage

### Custom Port
Edit `launch_web_server.py` and change the `port` variable:
```python
port = 8080  # Change to your preferred port
```

### Running in Background (Linux/Mac)
```bash
nohup python3 launch_web_server.py &
```

### Checking Server Status
When the server is running:
- Press Ctrl+C to stop
- The terminal shows access URLs
- Check http://localhost:8000 in browser

## 🆘 Support

If you encounter issues:

1. Check that Python is installed: `python --version`
2. Check that you're in the correct directory
3. Check that the `web/` folder exists
4. For ngrok issues, verify installation: `ngrok version`

## 📄 License

Part of the MobileBanks project.

---

**Happy Banking! 🏦💰**
