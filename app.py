from flask import Flask, render_template_string, request
from main import SocialScaleBooster

app = Flask(__name__)

# Simple HTML UI
HTML_PAGE = """
<!DOCTYPE html>
<html>
<head>
    <title>SocialScaleBooster 🚀</title>
    <style>
        body { font-family: Arial; background-color: #111; color: #fff; text-align: center; }
        input, textarea, select, button { margin: 10px; padding: 10px; font-size: 16px; }
        button { background-color: gold; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <h1>SocialScaleBooster 🚀</h1>
    <form method="POST">
        <textarea name="post" rows="4" cols="50" placeholder="Type your social media post here..." required></textarea><br>
        <select name="tone">
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
        </select><br>
        <button type="submit">Boost My Post</button>
    </form>
    {% if boosted_post %}
        <h2>Boosted Post:</h2>
        <p style="background:#222; padding:20px; border-radius:8px;">{{ boosted_post }}</p>
    {% endif %}
</body>
</html>
"""

@app.route("/", methods=["GET", "POST"])
def index():
    boosted_post = None
    if request.method == "POST":
        post = request.form.get("post")
        tone = request.form.get("tone")
        booster = SocialScaleBooster()
        boosted_post = booster.boost_post(post, tone)
    return render_template_string(HTML_PAGE, boosted_post=boosted_post)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=81)