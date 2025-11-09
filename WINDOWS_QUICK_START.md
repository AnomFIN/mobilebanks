# 🪟 Windows Quick Start Guide

## Simple 3-Step Setup

### Step 1: Install Python (if not installed)

1. Go to: https://www.python.org/downloads/
2. Download Python 3.x for Windows
3. ⚠️ **IMPORTANT:** Check "Add Python to PATH" during installation
4. Complete the installation

### Step 2: Choose Your Launcher

You have 3 easy options:

#### Option A: Interactive Menu (Recommended for first-time users)
- **Double-click:** `Launch_Web_Server.bat`
- Choose between local or public access
- Browser opens automatically

#### Option B: Quick Local Server
- **Double-click:** `Launch_Local_Server.bat`
- Starts immediately on `http://localhost:8000`
- Perfect for quick testing

#### Option C: Public Server (Share with anyone)
- **Double-click:** `Launch_Public_Server.bat`
- Requires ngrok (see below)
- Get a public URL to share

### Step 3: Access Your App

After launching, your browser will automatically open to:
- **Local:** `http://localhost:8000`
- **Network:** `http://your-ip:8000` (from other devices on WiFi)
- **Public:** `https://xxxxx.ngrok.io` (if using ngrok)

## 📌 Creating a Desktop Shortcut

### Method 1: Automatic (Easiest)
1. Double-click: `create_desktop_shortcut.py`
2. Follow the prompts
3. Done! Shortcut appears on Desktop

### Method 2: Manual (Simple)
1. Right-click on `Launch_Web_Server.bat`
2. Select "Send to" → "Desktop (create shortcut)"
3. Done!

## 🌍 Setting Up Public Access (Optional)

Want to share your app with anyone on the internet?

### Install ngrok:
1. Visit: https://ngrok.com/download
2. Download ngrok for Windows
3. Extract `ngrok.exe` to a folder (or same folder as the launcher)
4. Sign up for free account at: https://ngrok.com
5. Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken
6. Open Command Prompt and run:
   ```
   ngrok authtoken YOUR_AUTH_TOKEN
   ```
7. Done! Now `Launch_Public_Server.bat` will work

## 🎯 Which Launcher Should I Use?

| Launcher | When to Use | Access From |
|----------|-------------|-------------|
| `Launch_Web_Server.bat` | First time, want options | Your choice |
| `Launch_Local_Server.bat` | Quick testing | This PC or WiFi |
| `Launch_Public_Server.bat` | Share with others | Anywhere online |
| `Launch_Web_Server_Silent.vbs` | Cleaner (no console flash) | Any |

## ❓ Troubleshooting

### "Python is not recognized"
**Fix:** Python not in PATH
1. Reinstall Python
2. Check "Add Python to PATH"
3. Restart computer

### "Port 8000 is already in use"
**Fix:** Another program using the port
1. Close other servers
2. Or use custom port: `python launch_web_server.py --port 8080`

### "ngrok is not installed"
**Fix:** Only needed for public access
- Install ngrok (see instructions above)
- Or use local server instead

### Browser doesn't open automatically
**Fix:** Open manually
- Go to: `http://localhost:8000`

### Can't access from phone on same WiFi
**Fix:** Need your PC's IP address
1. Open Command Prompt
2. Type: `ipconfig`
3. Find "IPv4 Address" (like 192.168.1.100)
4. On phone, go to: `http://192.168.1.100:8000`

## 🎨 What You'll See

### Interactive Menu:
```
============================================================
          MobileBanks Web Server Launcher
============================================================

🎯 Choose how to access the application:

  1️⃣  Local network only (localhost)
      • Fast and simple
      • Access from this computer or local network
      • No internet required

  2️⃣  Public internet (with ngrok)
      • Access from anywhere on the internet
      • Share with others easily
      • Requires ngrok account (free)

  3️⃣  Exit

Enter your choice (1-3):
```

### After Starting:
```
🚀 Starting local web server on port 8000...
📁 Serving directory: C:\path\to\mobilebanks\web

✅ Server started successfully!
🌐 Local URL: http://localhost:8000

📝 Access the application at:
   • Local:   http://localhost:8000
   • Network: http://<your-ip>:8000

💡 Press Ctrl+C to stop the server

🌐 Opening browser...
```

## 🚀 Advanced Options

### Run from Command Line:
```bash
# Interactive menu
python launch_web_server.py

# Direct local server
python launch_web_server.py --local

# Direct ngrok server
python launch_web_server.py --ngrok

# Custom port
python launch_web_server.py --local --port 8080

# Help
python launch_web_server.py --help
```

## 📱 Access from Phone/Tablet

### Same WiFi:
1. Start local server on your PC
2. Find your PC's IP: `ipconfig` → IPv4 Address
3. On phone: Open browser → `http://YOUR-PC-IP:8000`

### Any Network:
1. Start with ngrok (`Launch_Public_Server.bat`)
2. Copy the ngrok URL (shown in terminal)
3. Open that URL on any device, anywhere

## 🔐 Security Notes

- **Local server:** Only accessible on your network (safe)
- **Ngrok:** Creates public URL (be careful what you share)
- **This is a demo app:** Not for production/real banking

## 💡 Tips

1. **Bookmark the URL** after launching for quick access
2. **Keep terminal open** while using the app (it's running the server)
3. **Press Ctrl+C** in terminal to stop the server
4. **Restart** if you make changes to the web files

## 🆘 Need More Help?

- See full documentation: [WEB_LAUNCHER_README.md](WEB_LAUNCHER_README.md)
- Check Python version: `python --version` (should be 3.6+)
- Test launcher: `python test_launcher.py`

---

**Enjoy your MobileBanks web app! 🏦💰**
