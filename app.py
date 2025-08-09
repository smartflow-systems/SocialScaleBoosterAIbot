
from flask import Flask, render_template_string, request, jsonify
from main import SocialScaleBooster

app = Flask(__name__)

# Simple HTML UI
HTML_PAGE = """
<!DOCTYPE html>
<html>
<head>
    <title>SocialScaleBooster 🚀</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            background-color: #111; 
            color: #fff; 
            text-align: center; 
            margin: 0; 
            padding: 20px; 
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        input, textarea, select, button { 
            margin: 10px; 
            padding: 12px; 
            font-size: 16px; 
            border-radius: 8px;
            border: 1px solid #333;
        }
        textarea {
            width: 90%;
            resize: vertical;
        }
        select {
            background-color: #222;
            color: #fff;
        }
        button { 
            background-color: #ffd700; 
            color: #111;
            border: none; 
            cursor: pointer; 
            font-weight: bold;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #ffed4e;
        }
        .result {
            background: #222; 
            padding: 20px; 
            border-radius: 8px;
            margin-top: 20px;
            border-left: 4px solid #ffd700;
        }
        .error {
            color: #ff6b6b;
            background: #2d1b1b;
            padding: 10px;
            border-radius: 8px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>SocialScaleBooster 🚀</h1>
        <p>Transform your social media posts with AI-powered enhancements!</p>
        
        <form method="POST">
            <textarea 
                name="post" 
                rows="4" 
                placeholder="Type your social media post here..." 
                required
                maxlength="500"
            ></textarea><br>
            
            <select name="tone">
                <option value="friendly">🌟 Friendly</option>
                <option value="professional">💼 Professional</option>
            </select><br>
            
            <button type="submit">✨ Boost My Post</button>
        </form>
        
        {% if error %}
            <div class="error">{{ error }}</div>
        {% endif %}
        
        {% if boosted_post %}
            <div class="result">
                <h2>🚀 Boosted Post:</h2>
                <p>{{ boosted_post }}</p>
            </div>
        {% endif %}
    </div>
</body>
</html>
"""

@app.route("/", methods=["GET", "POST"])
def index():
    boosted_post = None
    error = None
    
    if request.method == "POST":
        try:
            post = request.form.get("post", "").strip()
            tone = request.form.get("tone", "friendly").strip()
            
            if not post:
                error = "Please enter a post to boost!"
            elif len(post) > 500:
                error = "Post is too long! Please keep it under 500 characters."
            else:
                booster = SocialScaleBooster()
                result = booster.boost_post(post, tone)
                boosted_post = result['final_post']
                
        except Exception as e:
            error = f"An error occurred: {str(e)}"
    
    return render_template_string(HTML_PAGE, boosted_post=boosted_post, error=error)

@app.route("/api/boost", methods=["POST"])
def api_boost():
    try:
        data = request.get_json()
        
        if not data or 'post' not in data:
            return jsonify({'error': 'Missing post data'}), 400
        
        post = data['post'].strip()
        tone = data.get('tone', 'friendly').strip()
        
        if not post:
            return jsonify({'error': 'Post cannot be empty'}), 400
        
        if len(post) > 500:
            return jsonify({'error': 'Post too long (max 500 characters)'}), 400
        
        booster = SocialScaleBooster()
        result = booster.boost_post(post, tone)
        vibe = booster.vibe_detector(post)
        
        return jsonify({
            'success': True,
            'result': result,
            'vibe': vibe
        })
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route("/health")
def health_check():
    return jsonify({'status': 'healthy', 'service': 'SocialScaleBooster'})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=81, debug=True)
