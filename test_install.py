#!/usr/bin/env python3
"""
Unit tests for install.py
Tests Windows compatibility and subprocess handling
"""

import unittest
import os
import sys
import subprocess
from unittest.mock import patch, MagicMock

# Add parent directory to path to import install module
# This is acceptable for simple test scripts without complex packaging
# For production, consider using setup.py or pyproject.toml with proper package structure
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from install import normalize_cmd, run, popen


class TestNormalizeCmd(unittest.TestCase):
    """Test normalize_cmd function for Windows and Unix compatibility."""
    
    @patch('os.name', 'posix')
    def test_normalize_cmd_unix_list(self):
        """Test normalize_cmd on Unix with list input."""
        cmd = ['npm', 'install']
        result = normalize_cmd(cmd)
        self.assertEqual(result, (cmd, False))
    
    @patch('os.name', 'posix')
    def test_normalize_cmd_unix_tuple(self):
        """Test normalize_cmd on Unix with tuple input."""
        cmd = ('npm', 'ci')
        result = normalize_cmd(cmd)
        self.assertEqual(result, (cmd, False))
    
    @patch('os.name', 'posix')
    def test_normalize_cmd_unix_string(self):
        """Test normalize_cmd on Unix with string input."""
        cmd = 'npm install'
        result = normalize_cmd(cmd)
        self.assertEqual(result, (['npm', 'install'], False))
    
    @patch('os.name', 'nt')
    def test_normalize_cmd_windows_list(self):
        """Test normalize_cmd on Windows with list input."""
        cmd = ['npm', 'install']
        result = normalize_cmd(cmd)
        self.assertEqual(result, ('npm install', True))
    
    @patch('os.name', 'nt')
    def test_normalize_cmd_windows_tuple(self):
        """Test normalize_cmd on Windows with tuple input."""
        cmd = ('npm', 'ci')
        result = normalize_cmd(cmd)
        self.assertEqual(result, ('npm ci', True))
    
    @patch('os.name', 'nt')
    def test_normalize_cmd_windows_string(self):
        """Test normalize_cmd on Windows with string input."""
        cmd = 'node --version'
        result = normalize_cmd(cmd)
        self.assertEqual(result, ('node --version', True))
    
    @patch('os.name', 'nt')
    def test_normalize_cmd_windows_complex(self):
        """Test normalize_cmd on Windows with complex command."""
        cmd = ['npx', 'expo', 'start', '--tunnel']
        result = normalize_cmd(cmd)
        self.assertEqual(result, ('npx expo start --tunnel', True))
    
    @patch('os.name', 'nt')
    def test_normalize_cmd_windows_with_args(self):
        """Test normalize_cmd on Windows with arguments containing spaces."""
        cmd = ['npm', 'run', 'script-name']
        result = normalize_cmd(cmd)
        self.assertEqual(result, ('npm run script-name', True))


class TestRunFunction(unittest.TestCase):
    """Test run function wrapper for subprocess.run."""
    
    @patch('install.subprocess.run')
    @patch('os.name', 'posix')
    def test_run_unix_list(self, mock_run):
        """Test run function on Unix with list command."""
        mock_result = MagicMock()
        mock_run.return_value = mock_result
        
        cmd = ['node', '--version']
        result = run(cmd, check=True, capture_output=True)
        
        mock_run.assert_called_once_with(
            cmd,
            check=True,
            capture_output=True,
            text=True,
            shell=False
        )
        self.assertEqual(result, mock_result)
    
    @patch('install.subprocess.run')
    @patch('os.name', 'nt')
    def test_run_windows_list(self, mock_run):
        """Test run function on Windows with list command."""
        mock_result = MagicMock()
        mock_run.return_value = mock_result
        
        cmd = ['npm', 'install']
        result = run(cmd, check=True, capture_output=True)
        
        # On Windows, list should be converted to string with shell=True
        mock_run.assert_called_once_with(
            'npm install',
            check=True,
            capture_output=True,
            text=True,
            shell=True
        )
        self.assertEqual(result, mock_result)


class TestPopenFunction(unittest.TestCase):
    """Test popen function wrapper for subprocess.Popen."""
    
    @patch('install.subprocess.Popen')
    @patch('os.name', 'posix')
    def test_popen_unix_defaults(self, mock_popen):
        """Test popen function on Unix with default arguments."""
        mock_process = MagicMock()
        mock_popen.return_value = mock_process
        
        cmd = ['node', '--version']
        result = popen(cmd)
        
        # Check that Popen was called with correct arguments
        call_args = mock_popen.call_args
        self.assertEqual(call_args[0][0], cmd)
        self.assertTrue(call_args[1]['text'])
        self.assertEqual(call_args[1]['stdout'], subprocess.PIPE)
        self.assertFalse(call_args[1]['shell'])
        self.assertEqual(result, mock_process)
    
    @patch('install.subprocess.Popen')
    @patch('os.name', 'nt')
    def test_popen_windows_defaults(self, mock_popen):
        """Test popen function on Windows with default arguments."""
        mock_process = MagicMock()
        mock_popen.return_value = mock_process
        
        cmd = ['npm', 'start']
        result = popen(cmd)
        
        # Check that Popen was called with correct arguments
        call_args = mock_popen.call_args
        self.assertEqual(call_args[0][0], 'npm start')
        self.assertTrue(call_args[1]['text'])
        self.assertEqual(call_args[1]['stdout'], subprocess.PIPE)
        self.assertTrue(call_args[1]['shell'])
        self.assertEqual(result, mock_process)
    
    @patch('install.subprocess.Popen')
    @patch('os.name', 'posix')
    def test_popen_custom_kwargs(self, mock_popen):
        """Test popen function with custom kwargs."""
        mock_process = MagicMock()
        mock_popen.return_value = mock_process
        
        cmd = ['npm', 'install']
        result = popen(cmd, stderr=subprocess.PIPE)
        
        # Check that custom kwargs are passed through
        call_args = mock_popen.call_args
        self.assertEqual(call_args[1]['stderr'], subprocess.PIPE)


class TestCrossPlatformCompatibility(unittest.TestCase):
    """Test cross-platform compatibility scenarios."""
    
    @patch('os.name', 'nt')
    def test_windows_npm_command(self):
        """Test that npm commands work on Windows."""
        cmd = ['npm', 'ci']
        normalized, shell = normalize_cmd(cmd)
        self.assertEqual(normalized, 'npm ci')
        self.assertTrue(shell)
    
    @patch('os.name', 'nt')
    def test_windows_npx_command(self):
        """Test that npx commands work on Windows."""
        cmd = ['npx', 'expo', 'login']
        normalized, shell = normalize_cmd(cmd)
        self.assertEqual(normalized, 'npx expo login')
        self.assertTrue(shell)
    
    @patch('os.name', 'posix')
    def test_unix_npm_command(self):
        """Test that npm commands work on Unix."""
        cmd = ['npm', 'ci']
        normalized, shell = normalize_cmd(cmd)
        self.assertEqual(normalized, cmd)
        self.assertFalse(shell)
    
    @patch('os.name', 'posix')
    def test_unix_npx_command(self):
        """Test that npx commands work on Unix."""
        cmd = ['npx', 'expo', 'login']
        normalized, shell = normalize_cmd(cmd)
        self.assertEqual(normalized, cmd)
        self.assertFalse(shell)


def run_tests():
    """Run all tests and return results."""
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add all test classes
    suite.addTests(loader.loadTestsFromTestCase(TestNormalizeCmd))
    suite.addTests(loader.loadTestsFromTestCase(TestRunFunction))
    suite.addTests(loader.loadTestsFromTestCase(TestPopenFunction))
    suite.addTests(loader.loadTestsFromTestCase(TestCrossPlatformCompatibility))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()


if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
