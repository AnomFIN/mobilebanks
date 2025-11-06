# install.py - Expo Development Server Script

## Overview

`install.py` is a Python script that starts the Expo development server with automatic port conflict resolution. This is particularly useful on Windows where port conflicts can cause Expo to fail when run in non-interactive mode.

## Problem It Solves

When running `npx expo start --tunnel`, if port 8081 (Expo's default) is already in use, Expo will prompt:
```
Port 8081 is being used by another process
Use port 8082 instead?
Input is required
```

If Expo is running in a non-interactive process (e.g., with stdout piped), it cannot receive user input and will exit with "Skipping dev server".

## Solution

The `install.py` script:
1. Starts Expo with `npx expo start --tunnel`
2. Monitors Expo's output for port conflict messages
3. Automatically detects when a port is in use and Expo suggests an alternative
4. Handles the conflict in two ways:
   - **Interactive mode** (TTY): Asks the user to confirm using the suggested port
   - **Non-interactive mode**: Automatically restarts Expo with the suggested port

## Usage

### Basic Usage

```bash
python3 install.py
```

This will:
- Check that Node.js and npm are installed
- Start Expo development server with tunnel mode
- Handle port conflicts automatically

### Direct Function Usage

You can also import and use the function directly:

```python
from install import start_expo_and_show_qr

# Start with default port (8081)
start_expo_and_show_qr()

# Start with specific port
start_expo_and_show_qr(port=3000)
```

## Features

### Automatic Port Conflict Detection

The script detects these patterns in Expo's output:
- `Port <number> is being used by another process`
- `Use port <number> instead?`
- `Input is required` (case-insensitive)
- `Skipping dev server` (case-insensitive)

### Smart Handling Modes

**Interactive Mode (when stdin is a TTY):**
```
⚠️  Port conflict detected: Port 8081 is already in use
💡 Expo suggests using port 8082 instead

❓ Port 8081 is in use.
   Do you want to use port 8082 instead? (y/n):
```

**Non-Interactive Mode:**
```
⚠️  Port conflict detected: Port 8081 is already in use
💡 Expo suggests using port 8082 instead
🤖 Non-interactive mode detected. Automatically using port 8082...
```

### Graceful Process Management

- Properly terminates Expo process before restart
- Uses `process.terminate()` first (SIGTERM)
- Falls back to `process.kill()` (SIGKILL) if needed
- Cleans up resources on keyboard interrupt (Ctrl+C)

### Recursive Restart

If the suggested port is also in use, the script will:
1. Detect the new conflict
2. Get the next suggested port
3. Restart again automatically
4. Continue until a free port is found

## Requirements

- Python 3.6+
- Node.js 18+
- npm
- Expo CLI (installed via npx)

## How It Works

1. **Startup**: Script checks for Node.js and npm
2. **Launch Expo**: Starts `npx expo start --tunnel` with pipes
3. **Monitor Output**: Reads stdout line by line
4. **Detect Patterns**: Uses regex to find port conflict messages
5. **Handle Conflict**: 
   - Extracts current port and suggested port
   - Determines if running in interactive mode
   - Asks user (interactive) or proceeds automatically (non-interactive)
6. **Restart**: Kills current Expo process and relaunches with `--port <new_port>`
7. **Repeat**: If new port also conflicts, process repeats

## Exit Codes

- `0`: Success - Expo started successfully
- `1`: Error - Failed to start (missing dependencies, user declined, etc.)
- `130`: Interrupted - User pressed Ctrl+C

## Examples

### Example 1: First Port Conflict (Interactive)

```bash
$ python3 install.py
============================================================
MobileBanks - Expo Development Server
============================================================

✅ Node.js version: v20.10.0
✅ npm version: 10.2.3

Starting Expo development server with tunnel mode...
This will allow you to access the app from anywhere using Expo Go.

Starting Expo development server...
Command: npx expo start --tunnel
Starting Metro bundler...

⚠️  Port conflict detected: Port 8081 is already in use
💡 Expo suggests using port 8082 instead

❓ Port 8081 is in use.
   Do you want to use port 8082 instead? (y/n): y
✅ Restarting Expo on port 8082...
Starting Expo development server on port 8082...
Command: npx expo start --tunnel --port 8082
[QR Code appears here]
```

### Example 2: Multiple Port Conflicts (Non-Interactive)

```bash
$ echo "" | python3 install.py
[... setup output ...]

⚠️  Port conflict detected: Port 8081 is already in use
💡 Expo suggests using port 8082 instead
🤖 Non-interactive mode detected. Automatically using port 8082...

⚠️  Port conflict detected: Port 8082 is already in use
💡 Expo suggests using port 8083 instead
🤖 Non-interactive mode detected. Automatically using port 8083...

[Expo starts successfully on port 8083]
```

### Example 3: User Declines Alternative Port

```bash
$ python3 install.py
[... setup output ...]

⚠️  Port conflict detected: Port 8081 is already in use
💡 Expo suggests using port 8082 instead

❓ Port 8081 is in use.
   Do you want to use port 8082 instead? (y/n): n
❌ User declined to use alternate port. Exiting.
```

## Troubleshooting

### Script Won't Start

**Problem**: `python3: command not found`

**Solution**: Install Python 3:
- **Windows**: Download from [python.org](https://www.python.org/downloads/)
- **macOS**: `brew install python3`
- **Linux**: `sudo apt install python3` (Debian/Ubuntu) or `sudo yum install python3` (RHEL/CentOS)

### Node.js Not Found

**Problem**: `❌ Error: Node.js is not installed or not in PATH`

**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/) and ensure it's in your PATH.

### Expo Doesn't Restart

**Problem**: Script detects conflict but doesn't restart.

**Solution**: Check that:
1. The script has permission to execute (`chmod +x install.py` on Unix)
2. Expo CLI is installed globally or accessible via npx
3. You have permission to kill processes

### Port Still in Use

**Problem**: All suggested ports are in use.

**Solution**: 
1. Stop other services using ports 8081-8089
2. Or manually specify a high port: Modify script to use `--port 9000` (or higher)

## Technical Details

### Pattern Matching

The script uses these regex patterns:

```python
port_conflict_pattern = re.compile(r"Port (\d+) is being used by another process")
port_suggestion_pattern = re.compile(r"Use port (\d+) instead\?")
input_required_pattern = re.compile(r"Input is required", re.IGNORECASE)
skipping_dev_server_pattern = re.compile(r"Skipping dev server", re.IGNORECASE)
```

### Process Management

```python
# Start with pipes
process = subprocess.Popen(
    cmd,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    stdin=subprocess.PIPE,
    text=True,
    bufsize=1  # Line buffered
)

# Graceful termination
process.terminate()
try:
    process.wait(timeout=5)
except subprocess.TimeoutExpired:
    process.kill()
    process.wait()
```

### TTY Detection

```python
if sys.stdin.isatty():
    # Interactive: ask user
    response = input("Do you want to use port X instead? (y/n): ")
else:
    # Non-interactive: auto-accept
    print("Automatically using suggested port...")
```

## Integration with CI/CD

The script works well in CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Start Expo
  run: python3 install.py
  # Non-interactive mode will auto-handle port conflicts
```

```bash
# Jenkins example
pipeline {
    stage('Start Expo') {
        steps {
            sh 'python3 install.py'
        }
    }
}
```

## License

Part of the MobileBanks project. See main README for license information.

## See Also

- [README.md](README.md) - Main project documentation
- [SETUP.md](SETUP.md) - Setup instructions
- [INSTALLATION_TEST.md](INSTALLATION_TEST.md) - Testing checklist
