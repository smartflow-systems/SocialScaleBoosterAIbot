"""SocialScaleBooster - AI Caption Generator"""

import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from api.generate import generate_captions

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/health")
def health():
    """Health check"""
    return jsonify({"ok": True, "service": "SocialScaleBooster"})

@app.route("/api/generate", methods=["POST"])
def generate():
    """
    Generate captions + hashtags
    
    Request body:
    {
        "business_type": "barber",
        "post_description": "Fresh fade on a regular client",
        "vibe": "smooth"
    }
    """
    data = request.get_json()
    
    if not data:
        return jsonify({"success": False, "error": "No JSON body provided"}), 400
    
    business_type = data.get("business_type", "").lower()
    post_description = data.get("post_description", "").strip()
    vibe = data.get("vibe", "smooth").lower()
    
    if business_type not in ["barber", "salon", "gym"]:
        return jsonify({"success": False, "error": "business_type must be barber, salon, or gym"}), 400
    
    if not post_description or len(post_description) < 5:
        return jsonify({"success": False, "error": "post_description required (min 5 chars)"}), 400
    
    if vibe not in ["smooth", "hype", "professional"]:
        vibe = "smooth"
    
    result = generate_captions(business_type, post_description, vibe)
    
    if result["success"]:
        return jsonify(result), 200
    else:
        return jsonify(result), 500

@app.route("/")
def index():
    """Serve the main page"""
    if os.path.exists("index.html"):
        return send_from_directory(".", "index.html")
    else:
        return """
        <html>
        <head><title>SocialScaleBooster</title></head>
        <body style="font-family: system-ui; padding: 2rem; background: #0b0b0b; color: #e9e6e1;">
            <h1 style="color: #d4af37;">SocialScaleBooster 🚀</h1>
            <p>API is live. Test it:</p>
            <pre style="background: #1a1a1a; padding: 1rem; border-radius: 8px; overflow-x: auto;">
curl -X POST http://localhost:5000/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "business_type": "barber",
    "post_description": "Fresh fade, clean lineup, golden hour",
    "vibe": "smooth"
  }'
            </pre>
        </body>
        </html>
        """

@app.route("/<path:path>")
def static_files(path):
    """Serve static files"""
    return send_from_directory(".", path)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
