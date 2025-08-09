
#!/usr/bin/env python3
"""
Demo script to showcase SocialScaleBooster features
Run this for a quick demonstration of the bot's capabilities
"""

from main import SocialScaleBooster

def run_demo():
    print("🚀 SocialScaleBooster Demo 🚀")
    print("=" * 50)
    
    bot = SocialScaleBooster()
    
    # Demo posts
    demo_posts = [
        ("Check out my new product", "friendly"),
        ("We are launching our new service", "professional"),
        ("I'm so excited about this amazing opportunity", "friendly"),
        ("Our team achieved record sales this quarter", "professional"),
        ("Just finished an incredible project", "friendly")
    ]
    
    for i, (post, tone) in enumerate(demo_posts, 1):
        print(f"\n--- Demo {i} ---")
        print(f"📝 Input: '{post}' (tone: {tone})")
        
        result = bot.boost_post(post, tone)
        print(f"✨ Output: {result['final_post']}")
        
        vibe = bot.vibe_detector(post)
        print(f"🎯 {vibe}")
        print("-" * 30)
    
    print(f"\n✨ Demo completed! Your SocialScaleBooster is ready to use! ✨")
    print("💡 Run 'python main.py' for the interactive version.")
    print("🌐 Run 'python app.py' for the web interface.")

if __name__ == "__main__":
    run_demo()
