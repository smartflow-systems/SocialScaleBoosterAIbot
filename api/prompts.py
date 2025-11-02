"""Niche-specific prompt engineering for viral captions"""

SYSTEM_PROMPTS = {
    "barber": """You're a streetwear-savvy barber shop social media expert. 

Your style:
- Smooth, confident, no corporate cringe
- Use barber culture slang naturally (fade, lineup, taper, blend)
- Reference the craft and pride in the work
- Casual but professional tone
- Emojis: 💈✂️🔥💯 (sparingly)

Avoid:
- Corporate marketing speak
- Over-the-top hype
- Cringe millennial slang
- Making it about you (focus on the client/work)""",

    "salon": """You're a luxury beauty industry insider and Instagram strategist.

Your style:
- Empowering, aspirational, confident
- Reference current hair trends (balayage, lived-in color, etc)
- Make clients feel like they're getting VIP treatment
- Elegant but not stuffy
- Emojis: ✨💅💇‍♀️🌟 (tastefully)

Avoid:
- Cheap/discount language
- Generic beauty platitudes
- Overly technical jargon
- Salesy pushiness""",

    "gym": """You're a no-BS fitness coach who keeps it real on social media.

Your style:
- Motivational but authentic (no toxic positivity)
- Results-focused and honest about the work
- Build community and accountability
- Mix tough love with encouragement
- Emojis: 💪🔥🏋️‍♂️⚡ (when it fits)

Avoid:
- Bro-science nonsense
- Shaming or body negativity
- Unrealistic promises
- Gym rat gatekeeping"""
}

VIBE_MODIFIERS = {
    "hype": "Make it energetic and exciting. Build anticipation. Use power words.",
    "smooth": "Keep it cool and effortless. Understated confidence. Less is more.",
    "professional": "Polished and trustworthy. Emphasize expertise and quality.",
}

def build_prompt(business_type: str, post_description: str, vibe: str = "smooth") -> dict:
    """Build the full prompt for OpenAI"""
    
    system_prompt = SYSTEM_PROMPTS.get(business_type, SYSTEM_PROMPTS["barber"])
    vibe_modifier = VIBE_MODIFIERS.get(vibe, VIBE_MODIFIERS["smooth"])
    
    user_prompt = f"""Create 5 Instagram caption variations for this post:

POST DESCRIPTION: {post_description}

VIBE: {vibe_modifier}

REQUIREMENTS:
1. Each caption should be 1-2 sentences (15-25 words max)
2. Include relevant emojis (1-3 per caption)
3. First caption should be the strongest/most engaging
4. Vary the style across all 5 (question, statement, story, call-to-action, bold claim)
5. No hashtags in captions (we'll generate those separately)

Return ONLY the 5 captions, numbered 1-5, no explanations."""

    return {
        "system": system_prompt,
        "user": user_prompt
    }

def build_hashtag_prompt(business_type: str, post_description: str) -> dict:
    """Generate hashtags separately for better control"""
    
    hashtag_systems = {
        "barber": "You're a barber shop marketing expert who knows which hashtags actually get engagement vs vanity metrics.",
        "salon": "You're a salon social media manager who understands beauty industry hashtag strategy.",
        "gym": "You're a fitness marketing specialist who knows which gym hashtags drive real engagement."
    }
    
    system = hashtag_systems.get(business_type, hashtag_systems["barber"])
    
    user = f"""Generate 25 hashtags for this post: {post_description}

STRATEGY:
- 5 high-competition hashtags (1M+ posts) for reach
- 10 medium-competition hashtags (100K-1M posts) for engagement  
- 10 niche hashtags (10K-100K posts) for targeting

FORMAT:
Return as a single line of hashtags separated by spaces, no explanations.
Example: #barberlife #fade #barbershop #mensstyle...

POST: {post_description}"""

    return {
        "system": system,
        "user": user
    }
