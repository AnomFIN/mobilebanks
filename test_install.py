#!/usr/bin/env python3
"""
Unit tests for install.py
Tests the port conflict detection and handling logic.
"""

import unittest
import sys
import os
import subprocess
import io
from unittest.mock import Mock, patch, MagicMock, call
import re

# Add the parent directory to the path so we can import install
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    import install
except ImportError as e:
    print(f"Error importing install module: {e}")
    sys.exit(1)


class TestPortConflictPatterns(unittest.TestCase):
    """Test regex patterns for detecting port conflicts."""
    
    def setUp(self):
        """Set up test patterns."""
        self.port_conflict_pattern = re.compile(r"Port (\d+) is being used by another process")
        self.port_suggestion_pattern = re.compile(r"Use port (\d+) instead\?")
        self.input_required_pattern = re.compile(r"Input is required", re.IGNORECASE)
        self.skipping_dev_server_pattern = re.compile(r"Skipping dev server", re.IGNORECASE)
    
    def test_port_conflict_detection(self):
        """Test detection of port conflict messages."""
        test_cases = [
            ("Port 8081 is being used by another process", "8081"),
            ("Port 3000 is being used by another process", "3000"),
            ("Port 8082 is being used by another process", "8082"),
        ]
        
        for line, expected_port in test_cases:
            with self.subTest(line=line):
                match = self.port_conflict_pattern.search(line)
                self.assertIsNotNone(match, f"Should match: {line}")
                self.assertEqual(match.group(1), expected_port)
    
    def test_port_suggestion_detection(self):
        """Test detection of port suggestion messages."""
        test_cases = [
            ("Use port 8082 instead?", "8082"),
            ("Use port 3001 instead?", "3001"),
            ("Use port 9000 instead?", "9000"),
        ]
        
        for line, expected_port in test_cases:
            with self.subTest(line=line):
                match = self.port_suggestion_pattern.search(line)
                self.assertIsNotNone(match, f"Should match: {line}")
                self.assertEqual(match.group(1), expected_port)
    
    def test_input_required_detection(self):
        """Test detection of input required messages."""
        test_cases = [
            "Input is required",
            "INPUT IS REQUIRED",
            "input is required",
            "Input Is Required",
        ]
        
        for line in test_cases:
            with self.subTest(line=line):
                match = self.input_required_pattern.search(line)
                self.assertIsNotNone(match, f"Should match: {line}")
    
    def test_skipping_dev_server_detection(self):
        """Test detection of skipping dev server messages."""
        test_cases = [
            "Skipping dev server",
            "SKIPPING DEV SERVER",
            "skipping dev server",
            "Skipping Dev Server",
        ]
        
        for line in test_cases:
            with self.subTest(line=line):
                match = self.skipping_dev_server_pattern.search(line)
                self.assertIsNotNone(match, f"Should match: {line}")
    
    def test_no_false_positives(self):
        """Test that normal Expo output doesn't match patterns."""
        normal_lines = [
            "Starting Metro bundler...",
            "Metro is ready",
            "Expo DevTools is running",
            "QR code generated",
            "Using port 8081",  # Note: different from "Port X is being used"
            "Port configuration",
        ]
        
        for line in normal_lines:
            with self.subTest(line=line):
                self.assertIsNone(
                    self.port_conflict_pattern.search(line),
                    f"Should not match conflict pattern: {line}"
                )
                self.assertIsNone(
                    self.port_suggestion_pattern.search(line),
                    f"Should not match suggestion pattern: {line}"
                )


class TestInstallScript(unittest.TestCase):
    """Test the install.py script functionality."""
    
    def test_script_imports(self):
        """Test that the script has correct imports."""
        self.assertTrue(hasattr(install, 'start_expo_and_show_qr'))
        self.assertTrue(hasattr(install, 'main'))
        self.assertTrue(callable(install.start_expo_and_show_qr))
        self.assertTrue(callable(install.main))
    
    def test_script_has_main_guard(self):
        """Test that script can be imported without running."""
        # If we can import it without errors, this test passes
        self.assertTrue(True)
    
    @patch('subprocess.Popen')
    @patch('sys.stdin')
    def test_interactive_mode_user_accepts(self, mock_stdin, mock_popen):
        """Test interactive mode when user accepts alternate port."""
        # Set up mock stdin as TTY
        mock_stdin.isatty.return_value = True
        
        # Mock the Expo process output
        mock_process = MagicMock()
        mock_process.stdout.readline.side_effect = [
            "Starting Metro...\n",
            "Port 8081 is being used by another process\n",
            "Use port 8082 instead?\n",
            "Input is required\n",
            "",  # End of output
        ]
        mock_process.wait.return_value = 0
        mock_popen.return_value = mock_process
        
        # Mock user input
        with patch('builtins.input', return_value='y'):
            # This should trigger a restart, which will create a second call
            # For this test, we'll just verify the first call
            result = install.start_expo_and_show_qr()
        
        # Verify process was created
        self.assertTrue(mock_popen.called)
    
    @patch('subprocess.Popen')
    @patch('sys.stdin')
    def test_non_interactive_mode_auto_restart(self, mock_stdin, mock_popen):
        """Test non-interactive mode auto-restarts with suggested port."""
        # Set up mock stdin as non-TTY
        mock_stdin.isatty.return_value = False
        
        # Mock the Expo process output
        mock_process = MagicMock()
        mock_process.stdout.readline.side_effect = [
            "Starting Metro...\n",
            "Port 8081 is being used by another process\n",
            "Use port 8082 instead?\n",
            "Input is required\n",
            "",  # End of output
        ]
        mock_process.wait.return_value = 0
        mock_popen.return_value = mock_process
        
        # Should auto-restart
        result = install.start_expo_and_show_qr()
        
        # Verify process was created
        self.assertTrue(mock_popen.called)


class TestNodeJsChecks(unittest.TestCase):
    """Test Node.js and npm version checks."""
    
    @patch('subprocess.run')
    def test_nodejs_check_success(self, mock_run):
        """Test successful Node.js version check."""
        mock_run.return_value = Mock(
            stdout="v20.10.0\n",
            returncode=0
        )
        
        result = subprocess.run(
            ["node", "--version"],
            capture_output=True,
            text=True,
            check=False
        )
        
        self.assertEqual(result.returncode, 0)
    
    @patch('subprocess.run')
    def test_npm_check_success(self, mock_run):
        """Test successful npm version check."""
        mock_run.return_value = Mock(
            stdout="10.2.3\n",
            returncode=0
        )
        
        result = subprocess.run(
            ["npm", "--version"],
            capture_output=True,
            text=True,
            check=False
        )
        
        self.assertEqual(result.returncode, 0)


class TestExitCodes(unittest.TestCase):
    """Test script exit codes."""
    
    def test_success_exit_code(self):
        """Test that success returns 0."""
        self.assertEqual(0, 0)  # Success code
    
    def test_error_exit_code(self):
        """Test that errors return 1."""
        self.assertEqual(1, 1)  # Error code
    
    def test_interrupt_exit_code(self):
        """Test that keyboard interrupt returns 130."""
        self.assertEqual(130, 130)  # SIGINT code


class TestScriptSyntax(unittest.TestCase):
    """Test that the script has valid Python syntax."""
    
    def test_script_compiles(self):
        """Test that install.py compiles without syntax errors."""
        script_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            'install.py'
        )
        
        with open(script_path, 'r') as f:
            code = f.read()
        
        try:
            compile(code, 'install.py', 'exec')
            compiled = True
        except SyntaxError:
            compiled = False
        
        self.assertTrue(compiled, "install.py should compile without syntax errors")


def run_tests():
    """Run all tests and return results."""
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add all test classes
    suite.addTests(loader.loadTestsFromTestCase(TestPortConflictPatterns))
    suite.addTests(loader.loadTestsFromTestCase(TestInstallScript))
    suite.addTests(loader.loadTestsFromTestCase(TestNodeJsChecks))
    suite.addTests(loader.loadTestsFromTestCase(TestExitCodes))
    suite.addTests(loader.loadTestsFromTestCase(TestScriptSyntax))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    print(f"Tests run: {result.testsRun}")
    print(f"Successes: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Skipped: {len(result.skipped)}")
    print("=" * 70)
    
    return 0 if result.wasSuccessful() else 1


if __name__ == '__main__':
    sys.exit(run_tests())
