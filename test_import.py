
#!/usr/bin/env python3
"""
Test script for SocialScaleBooster functionality
"""

try:
    from main import SocialScaleBooster
    
    def test_basic_functionality():
        print("🧪 Testing SocialScaleBooster...")
        
        booster = SocialScaleBooster()
        
        # Test cases
        test_cases = [
            ("Launching my new product!", "friendly"),
            ("We are pleased to announce our quarterly results", "professional"),
            ("", "friendly"),  # Edge case: empty string
            ("A" * 600, "friendly"),  # Edge case: very long string
        ]
        
        for i, (post, tone) in enumerate(test_cases, 1):
            print(f"\n--- Test {i} ---")
            print(f"Input: '{post[:50]}{'...' if len(post) > 50 else ''}' (tone: {tone})")
            
            try:
                result = booster.boost_post(post, tone)
                print(f"✅ Success: {result['final_post'][:100]}{'...' if len(result['final_post']) > 100 else ''}")
                
                # Test vibe detector
                vibe = booster.vibe_detector(post)
                print(f"🎯 Vibe: {vibe}")
                
            except Exception as e:
                print(f"❌ Error: {e}")
        
        print("\n🎉 Testing completed!")

    if __name__ == "__main__":
        test_basic_functionality()

except ImportError as e:
    print(f"❌ Import Error: {e}")
    print("Make sure main.py exists and contains the SocialScaleBooster class.")
except Exception as e:
    print(f"❌ Unexpected Error: {e}")
