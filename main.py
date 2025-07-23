#!/usr/bin/env python3
"""
SocialScaleBooster - A social media post enhancement bot
Adjusts tone, adds hashtags, and sprinkles pizzazz to social media posts
"""

import re
import random
from typing import List, Dict, Tuple

class SocialScaleBooster:
    def __init__(self):
        self.tone_adjustments = {
            'friendly': {
                'prefixes': ['Hey!', 'Hi there!', 'Hello!', 'Hey everyone!'],
                'suffixes': ['Hope you love it!', 'Let me know what you think!', 'Excited to share!'],
                'connectors': ['btw', 'also', 'plus']
            },
            'professional': {
                'prefixes': ['We are pleased to announce', 'I am excited to share', 'Proud to present'],
                'suffixes': ['Thank you for your attention.', 'We appreciate your interest.', 'Best regards.'],
                'connectors': ['furthermore', 'additionally', 'moreover']
            }
        }
        
        self.emoji_sets = {
            'friendly': ['😊', '🎉', '💖', '🌟', '🔥', '✨', '🚀', '💪', '🎊', '😄'],
            'professional': ['🚀', '💼', '📈', '⭐', '🏆', '💡', '🎯', '✅', '📊', '🌟']
        }
        
        # Common keywords to hashtag mapping
        self.keyword_hashtags = {
            'product': ['#ProductLaunch', '#NewProduct', '#Innovation'],
            'business': ['#Business', '#Entrepreneurship', '#Success'],
            'new': ['#NewRelease', '#Launch', '#Fresh'],
            'awesome': ['#Awesome', '#Amazing', '#Great'],
            'team': ['#TeamWork', '#Collaboration', '#Together'],
            'growth': ['#Growth', '#Progress', '#Development'],
            'tech': ['#Technology', '#TechLife', '#Innovation'],
            'marketing': ['#Marketing', '#DigitalMarketing', '#Strategy'],
            'social': ['#SocialMedia', '#Community', '#Engagement'],
            'media': ['#SocialMedia', '#Content', '#Digital']
        }

    def extract_keywords(self, text: str) -> List[str]:
        """Extract potential keywords from the post text"""
        # Remove punctuation and convert to lowercase
        clean_text = re.sub(r'[^\w\s]', '', text.lower())
        words = clean_text.split()
        
        # Filter out common stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those'}
        keywords = [word for word in words if word not in stop_words and len(word) > 2]
        
        return keywords

    def generate_hashtags(self, text: str, count: int = 4) -> List[str]:
        """Generate relevant hashtags based on post content"""
        keywords = self.extract_keywords(text)
        hashtags = set()
        
        # Find hashtags based on keywords
        for keyword in keywords:
            if keyword in self.keyword_hashtags:
                hashtags.update(self.keyword_hashtags[keyword][:2])
        
        # Add some generic popular hashtags if we don't have enough
        generic_hashtags = ['#Success', '#Motivation', '#Inspiration', '#Goals', '#Achievement', '#Excellence']
        
        while len(hashtags) < count:
            hashtag = random.choice(generic_hashtags)
            if hashtag not in hashtags:
                hashtags.add(hashtag)
        
        return list(hashtags)[:count]

    def add_tone_adjustment(self, text: str, tone: str) -> str:
        """Adjust the tone of the post"""
        if tone not in self.tone_adjustments:
            return text
        
        adjustments = self.tone_adjustments[tone]
        
        # Add a prefix
        prefix = random.choice(adjustments['prefixes'])
        
        # Add a suffix (sometimes)
        suffix = random.choice(adjustments['suffixes']) if random.random() > 0.6 else ""
        
        # Combine the text
        if suffix:
            adjusted_text = f"{prefix} {text} {suffix}"
        else:
            adjusted_text = f"{prefix} {text}"
        
        return adjusted_text

    def add_pizzazz(self, text: str, tone: str) -> str:
        """Add emojis and flair to the post"""
        emojis = self.emoji_sets.get(tone, self.emoji_sets['friendly'])
        
        # Add 1-3 emojis
        num_emojis = random.randint(1, 3)
        selected_emojis = random.sample(emojis, min(num_emojis, len(emojis)))
        
        # Add emojis at the end
        pizzazz_text = f"{text} {' '.join(selected_emojis)}"
        
        return pizzazz_text

    def boost_post(self, original_post: str, tone: str = 'friendly') -> Dict[str, str]:
        """Main function to boost a social media post"""
        if tone not in ['friendly', 'professional']:
            tone = 'friendly'
        
        # Step 1: Adjust tone
        tone_adjusted = self.add_tone_adjustment(original_post, tone)
        
        # Step 2: Add pizzazz (emojis)
        with_pizzazz = self.add_pizzazz(tone_adjusted, tone)
        
        # Step 3: Generate hashtags
        hashtags = self.generate_hashtags(original_post)
        
        # Step 4: Combine everything
        final_post = f"{with_pizzazz} {' '.join(hashtags)}"
        
        return {
            'original': original_post,
            'tone': tone,
            'tone_adjusted': tone_adjusted,
            'with_pizzazz': with_pizzazz,
            'hashtags': hashtags,
            'final_post': final_post
        }

    def vibe_detector(self, text: str) -> str:
        """Bonus feature: Detect the vibe/mood of the post and suggest appropriate emojis"""
        text_lower = text.lower()
        
        # Define mood keywords and their corresponding emojis
        mood_patterns = {
            'excited': (['excited', 'amazing', 'awesome', 'incredible', 'fantastic'], ['🎉', '🚀', '🔥', '✨']),
            'grateful': (['thank', 'grateful', 'appreciate', 'blessed'], ['🙏', '💖', '🌟', '😊']),
            'proud': (['proud', 'achievement', 'accomplished', 'success'], ['🏆', '💪', '🎯', '⭐']),
            'innovative': (['new', 'innovative', 'creative', 'launch'], ['💡', '🚀', '🆕', '🔮']),
            'team': (['team', 'together', 'collaboration', 'partnership'], ['🤝', '👥', '💫', '🌈'])
        }
        
        detected_vibes = []
        for mood, (keywords, emojis) in mood_patterns.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_vibes.append((mood, random.choice(emojis)))
        
        if detected_vibes:
            vibe, emoji = random.choice(detected_vibes)
            return f"Detected vibe: {vibe} {emoji}"
        else:
            return "Detected vibe: neutral 😊"


def main():
    """Demo function to test the SocialScaleBooster"""
    bot = SocialScaleBooster()
    
    print("🚀 Welcome to SocialScaleBooster! 🚀")
    print("=" * 50)
    
    while True:
        print("\nOptions:")
        print("1. Boost a post")
        print("2. Vibe detector demo")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == '1':
            # Get user input
            post = input("\nEnter your social media post: ").strip()
            if not post:
                print("Please enter a valid post!")
                continue
                
            tone = input("Enter tone (friendly/professional) [default: friendly]: ").strip().lower()
            if tone not in ['friendly', 'professional']:
                tone = 'friendly'
            
            # Boost the post
            result = bot.boost_post(post, tone)
            
            # Display results
            print("\n" + "="*50)
            print("BOOSTED POST RESULTS:")
            print("="*50)
            print(f"Original: {result['original']}")
            print(f"Tone: {result['tone']}")
            print(f"Final Post: {result['final_post']}")
            print(f"Hashtags: {', '.join(result['hashtags'])}")
            
            # Show vibe detection
            vibe = bot.vibe_detector(post)
            print(f"Bonus - {vibe}")
            
        elif choice == '2':
            post = input("\nEnter a post for vibe detection: ").strip()
            if post:
                vibe = bot.vibe_detector(post)
                print(f"\n{vibe}")
            else:
                print("Please enter a valid post!")
                
        elif choice == '3':
            print("\nThanks for using SocialScaleBooster! 🚀")
            break
        else:
            print("Invalid choice. Please enter 1, 2, or 3.")


if __name__ == "__main__":
    main()