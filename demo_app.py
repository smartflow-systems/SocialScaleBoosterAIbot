#!/usr/bin/env python3
"""
SmartFlow AI - Demo Flask App
Simple demo without external dependencies for testing dual-mode setup
"""

import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock AI-powered social media post generator
class SimpleDemoBooster:
    def boost_post(self, text, tone="friendly"):
        """Demo version of post boosting without OpenAI dependency"""
        hashtags = ["#Success", "#Growth", "#AI", "#Innovation"]
        
        if tone.lower() == "professional":
            enhanced_text = f"✨ {text} 🚀 Professional insights for maximum impact."
            hashtags.extend(["#Professional", "#Business", "#Excellence"])
        else:
            enhanced_text = f"🌟 {text} Amazing content ahead! 💪"
            hashtags.extend(["#Amazing", "#Awesome", "#Trending"])
        
        return {
            "final_post": f"{enhanced_text} {' '.join(hashtags)}",
            "hashtags": hashtags,
            "vibe": f"Detected vibe: {tone} 😊"
        }

@app.route("/")
def home():
    return jsonify({
        "app": "SmartFlow AI - Demo Flask Mode",
        "version": "v1.0-demo",
        "status": "running",
        "endpoints": ["/health", "/api/boost"]
    })

@app.route("/health")
def health():
    return jsonify({"ok": True})

@app.route("/api/boost", methods=["POST"])
def api_boost():
    try:
        data = request.get_json(force=True) or {}
        text = (data.get("post") or "").strip()
        tone = (data.get("tone") or "friendly").lower()
        
        if not text:
            return jsonify({"error": "post is required"}), 400
        
        if tone not in ("friendly", "professional"):
            tone = "friendly"

        booster = SimpleDemoBooster()
        result = booster.boost_post(text, tone)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", "3000"))
    app.run(host="0.0.0.0", port=port, debug=True)