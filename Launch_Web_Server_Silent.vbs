' ============================================
' MobileBanks Web Server Silent Launcher
' ============================================
' This VBScript launches the Python web server without showing a console window
' Double-click this file for a cleaner experience

Set WshShell = CreateObject("WScript.Shell")

' Get the directory where this script is located
strScriptPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

' Change to the script directory
WshShell.CurrentDirectory = strScriptPath

' Check if Python is installed
On Error Resume Next
WshShell.Run "python --version", 0, True
If Err.Number <> 0 Then
    MsgBox "ERROR: Python is not installed or not in PATH" & vbCrLf & vbCrLf & _
           "Please install Python from https://www.python.org/downloads/" & vbCrLf & _
           "Make sure to check 'Add Python to PATH' during installation", _
           vbCritical, "MobileBanks Web Server"
    WScript.Quit 1
End If
On Error GoTo 0

' Launch the Python script with a visible window (user needs to see the menu)
' Using window style 1 = Normal window
WshShell.Run "python launch_web_server.py", 1, False

' Alternative: To launch completely hidden (for automation):
' WshShell.Run "python launch_web_server.py", 0, False
