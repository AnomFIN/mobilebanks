# Ngrok Quick Start Guide

## 🚀 Using the Public Server Option (Ngrok)

The web launcher now makes it super easy to share your app publicly on the internet!

### First Time Setup (Automatic!)

1. **Run the launcher**:
   ```bash
   python launch_web_server.py
   ```
   Or double-click `Launch_Web_Server.bat` on Windows

2. **Select option 2** (Public internet with ngrok)

3. **Follow the interactive wizard**:
   - The script will detect if ngrok needs authentication
   - It will guide you through creating a free ngrok account
   - You'll be prompted to enter your authtoken
   - The script automatically configures everything!

4. **Get your public URL**:
   ```
   ============================================================
     ✅ SUCCESS! Your app is now publicly accessible!
   ============================================================
   
   🌐 Public URL:
      https://abc123-45-67-89-10.ngrok.io
   
   📱 Share this URL with anyone to give them access!
   ```

5. **Share and enjoy!**
   - The URL is automatically copied to your screen
   - Your browser opens with the public URL
   - Share the URL with anyone, anywhere in the world
   - They can access your app instantly!

### Subsequent Uses

Once you've set up ngrok once, it just works:
1. Run the launcher
2. Select option 2
3. Your public URL appears immediately
4. Done! ✨

### Getting Your Authtoken

If you need to get your authtoken manually:

1. Go to: https://dashboard.ngrok.com/signup
2. Create a free account (takes 1 minute)
3. Visit: https://dashboard.ngrok.com/get-started/your-authtoken
4. Copy your authtoken (looks like: `2abc...xyz123`)
5. Paste it when the launcher asks for it

### Tips

- ✅ **Free Account**: Ngrok is free for personal use
- ✅ **HTTPS**: Your URL automatically uses secure HTTPS
- ✅ **Temporary**: The URL changes each time you restart (get a static URL with paid plans)
- ✅ **No Port Forwarding**: No router configuration needed
- ✅ **Works Everywhere**: Share with anyone, on any network

### Troubleshooting

#### "ngrok is not installed"
1. Download from: https://ngrok.com/download
2. Extract to your system PATH or the project folder
3. Restart the launcher

#### "Failed to configure authtoken"
- Make sure you copied the complete authtoken
- Check that ngrok is properly installed
- Try running: `ngrok version` to verify installation

#### "Could not retrieve public URL"
- Wait a few more seconds and check the output
- Visit: https://dashboard.ngrok.com/tunnels/agents to see active tunnels
- Make sure no firewall is blocking ngrok

### Direct Launch (Skip Menu)

For quick access, use:
```bash
# Command line
python launch_web_server.py --ngrok

# Windows batch file
Launch_Public_Server.bat
```

Both will start ngrok directly, handling authentication automatically if needed.

## 🎉 That's It!

The improved launcher takes care of everything - just follow the prompts and you're online in minutes!

---

**Happy Sharing! 🌐**
