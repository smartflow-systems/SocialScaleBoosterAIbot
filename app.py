
from flask import Flask, render_template_string, request, jsonify
from flask_cors import CORS
from main import SocialScaleBooster

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

HTML_PAGE = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>SocialScaleBooster 🚀</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    :root { --bg:#0e0e0e; --panel:#151515; --text:#f6f6f6; --gold:#d4af37; }
    body { margin:0; font-family: system-ui, Arial; background:var(--bg); color:var(--text);}
    .wrap { max-width:820px; margin:40px auto; padding:20px; }
    .card { background:var(--panel); border:1px solid #222; border-radius:12px; padding:20px; }
    h1 { margin:0 0 16px 0; }
    p.sub { color:#bbb; margin:6px 0 18px; }
    textarea, select { width:100%; padding:12px; border-radius:8px; border:1px solid #333; background:#0b0b0b; color:var(--text); }
    .row { display:flex; gap:12px; align-items:center; margin:12px 0; }
    button { padding:12px 16px; border-radius:10px; border:none; background:var(--gold); color:#000; font-weight:700; cursor:pointer;}
    .out { margin-top:16px; padding:14px; background:#0b0b0b; border:1px solid #333; border-radius:8px; white-space:pre-wrap;}
    .meta { font-size:12px; color:#aaa; display:flex; gap:16px; }
    .pill { padding:4px 8px; border:1px solid #333; border-radius:999px; }
    .flex { display:flex; gap:12px; flex-wrap:wrap; }
    small { color:#9a9a9a; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>SocialScaleBooster 🚀</h1>
      <p class="sub">Turn rough ideas into scroll-stopping captions. Choose a tone, get smart hashtags + vibe.</p>

      <label for="post"><small>Write your post (max 300 chars)</small></label>
      <textarea id="post" rows="4" maxlength="300" placeholder="E.g. New fade slots at 4pm + 5pm. DM to book."></textarea>
      <div class="meta">
        <span id="count" class="pill">0 / 300</span>
        <span class="pill">Tone</span>
      </div>

      <div class="row">
        <select id="tone">
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
        </select>
        <button id="boostBtn">Boost My Post</button>
        <button id="copyBtn" style="display:none;">Copy</button>
      </div>

      <div id="result" class="out" style="display:none;"></div>
      <div id="vibe" class="out" style="display:none;"></div>
    </div>
    <p class="sub">Built with ❤️ by SmartFlowSystems. <small>v0.2</small></p>
  </div>

  <script>
    const post = document.getElementById('post');
    const count = document.getElementById('count');
    const tone = document.getElementById('tone');
    const boostBtn = document.getElementById('boostBtn');
    const copyBtn = document.getElementById('copyBtn');
    const result = document.getElementById('result');
    const vibe = document.getElementById('vibe');

    // live character counter
    const updateCount = () => { count.textContent = post.value.length + " / 300"; };
    post.addEventListener('input', updateCount); updateCount();

    boostBtn.onclick = async () => {
      const body = { post: post.value.trim(), tone: tone.value };
      if (!body.post) { alert("Write something first 🙂"); return; }
      boostBtn.disabled = true; boostBtn.textContent = "Boosting…";

      try {
        const res = await fetch("/api/boost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        result.style.display = 'block';
        vibe.style.display = 'block';
        result.textContent = data.final_post;
        vibe.textContent = data.vibe;
        copyBtn.style.display = 'inline-block';
      } catch (e) {
        alert("Error: " + e.message);
      } finally {
        boostBtn.disabled = false; boostBtn.textContent = "Boost My Post";
      }
    };

    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(result.textContent);
        copyBtn.textContent = "Copied!";
        setTimeout(()=> copyBtn.textContent = "Copy", 1200);
      } catch (e) { alert("Copy failed"); }
    };
  </script>
</body>
</html>
"""

@app.route("/", methods=["GET"])
def home():
    return render_template_string(HTML_PAGE)

# -------- v0.2: JSON API endpoint ----------
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

        booster = SocialScaleBooster()
        result = booster.boost_post(text, tone)
        vibe = booster.vibe_detector(text)

        return jsonify({
            "final_post": result["final_post"],
            "hashtags": result["hashtags"],
            "vibe": vibe
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return {"ok": True}, 200, {"Cache-Control": "no-store"}

import os
if __name__ == "__main__":
    port = int(os.getenv("PORT", "3000"))
    app.run(host="0.0.0.0", port=port)