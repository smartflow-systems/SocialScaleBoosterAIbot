#!/usr/bin/env python3
"""
SmartFlow AI - Dual Mode Manager
Web interface to manage Python Flask vs Node.js applications
"""

import subprocess
import time
import signal
import os
import requests
from flask import Flask, render_template_string, request, jsonify, redirect, url_for
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

current_process = None
current_mode = "none"

# HTML template for the mode manager
TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>SmartFlow AI - Dual Mode Manager</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #2c1810 0%, #1a0f0a 100%);
            color: #ffd700;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(0,0,0,0.3);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        h1 {
            text-align: center;
            color: #ffd700;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .mode-selector {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            justify-content: center;
        }
        .mode-card {
            background: rgba(255,215,0,0.1);
            border: 2px solid #ffd700;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
            max-width: 300px;
        }
        .mode-card:hover {
            background: rgba(255,215,0,0.2);
            transform: translateY(-2px);
        }
        .mode-card.active {
            background: rgba(255,215,0,0.3);
            border-color: #ffed4e;
        }
        .mode-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .mode-desc {
            font-size: 14px;
            opacity: 0.8;
        }
        .status {
            text-align: center;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .status.running {
            background: rgba(0,255,0,0.2);
            border: 1px solid #00ff00;
        }
        .status.stopped {
            background: rgba(255,0,0,0.2);
            border: 1px solid #ff0000;
        }
        .test-section {
            margin-top: 30px;
            padding: 20px;
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
        }
        .test-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        input, textarea, button {
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #ffd700;
            background: rgba(0,0,0,0.3);
            color: #ffd700;
            font-size: 14px;
        }
        button {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #000;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255,215,0,0.3);
        }
        .result {
            margin-top: 15px;
            padding: 15px;
            background: rgba(0,0,0,0.3);
            border-radius: 6px;
            white-space: pre-wrap;
            font-family: monospace;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 SmartFlow AI - Dual Mode Manager</h1>
        
        <div class="mode-selector">
            <div class="mode-card {{ 'active' if mode == 'python' else '' }}" onclick="switchMode('python')">
                <div class="mode-title">🐍 Python Flask</div>
                <div class="mode-desc">AI Social Media Post Generator<br>OpenAI-powered content creation</div>
            </div>
            <div class="mode-card {{ 'active' if mode == 'node' else '' }}" onclick="switchMode('node')">
                <div class="mode-title">🚀 Node.js Platform</div>
                <div class="mode-desc">Full SmartFlow AI Platform<br>Complete bot management system</div>
            </div>
        </div>
        
        <div class="status {{ 'running' if mode != 'none' else 'stopped' }}">
            <strong>Status:</strong> 
            {% if mode == 'python' %}
                🐍 Python Flask mode running on port 3000
            {% elif mode == 'node' %}
                🚀 Node.js platform running on port 3000
            {% else %}
                ⏹️ No application running
            {% endif %}
        </div>
        
        {% if mode == 'python' %}
        <div class="test-section">
            <h3>🧪 Test AI Post Generator</h3>
            <div class="test-form">
                <textarea id="postText" placeholder="Enter your social media post content..." rows="3"></textarea>
                <select id="toneSelect">
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                </select>
                <button onclick="testPostGenerator()">Generate Enhanced Post</button>
                <div id="result" class="result" style="display:none;"></div>
            </div>
        </div>
        {% elif mode == 'node' %}
        <div class="test-section">
            <h3>🧪 Test SmartFlow Platform</h3>
            <p>Node.js platform is running! Features include:</p>
            <ul>
                <li>📊 Advanced Analytics Dashboard</li>
                <li>🤖 Bot Management System</li>
                <li>🛒 Template Marketplace</li>
                <li>💳 Stripe Payment Integration</li>
                <li>🔗 Multi-platform Integrations</li>
            </ul>
            <button onclick="window.open('/', '_blank')">Open SmartFlow AI Platform</button>
        </div>
        {% endif %}
    </div>

    <script>
        function switchMode(newMode) {
            fetch('/switch/' + newMode, {method: 'POST'})
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setTimeout(() => location.reload(), 2000);
                    }
                });
        }
        
        function testPostGenerator() {
            const text = document.getElementById('postText').value;
            const tone = document.getElementById('toneSelect').value;
            const resultDiv = document.getElementById('result');
            
            if (!text.trim()) {
                alert('Please enter some post content');
                return;
            }
            
            resultDiv.style.display = 'block';
            resultDiv.textContent = 'Generating enhanced post...';
            
            fetch('/test-api', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({post: text, tone: tone})
            })
            .then(response => response.json())
            .then(data => {
                if (data.final_post) {
                    resultDiv.textContent = JSON.stringify(data, null, 2);
                } else {
                    resultDiv.textContent = 'Error: ' + JSON.stringify(data);
                }
            })
            .catch(error => {
                resultDiv.textContent = 'Error: ' + error.message;
            });
        }
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(TEMPLATE, mode=current_mode)

@app.route('/switch/<mode>', methods=['POST'])
def switch_mode(mode):
    global current_process, current_mode
    
    # Stop current process
    if current_process:
        try:
            current_process.terminate()
            current_process.wait(timeout=5)
        except:
            try:
                current_process.kill()
            except:
                pass
        current_process = None
    
    # Kill any existing processes
    subprocess.run(['pkill', '-f', 'tsx'], capture_output=True)
    subprocess.run(['pkill', '-f', 'node'], capture_output=True)
    subprocess.run(['pkill', '-f', 'python3.*app.py'], capture_output=True)
    time.sleep(1)
    
    try:
        if mode == 'python':
            # Start Python Flask app
            env = os.environ.copy()
            env['PORT'] = '3000'
            current_process = subprocess.Popen(['python3', 'app.py'], env=env)
            current_mode = 'python'
            
        elif mode == 'node':
            # Start Node.js app
            env = os.environ.copy()
            env['PORT'] = '3000'
            env['NODE_ENV'] = 'development'
            current_process = subprocess.Popen(['npm', 'run', 'dev'], env=env)
            current_mode = 'node'
            
        else:
            current_mode = 'none'
            
        return jsonify({'success': True, 'mode': current_mode})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/test-api', methods=['POST'])
def test_api():
    """Proxy to test the Flask API when it's running"""
    try:
        data = request.get_json()
        response = requests.post('http://localhost:3000/api/boost', json=data, timeout=10)
        return response.json()
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)