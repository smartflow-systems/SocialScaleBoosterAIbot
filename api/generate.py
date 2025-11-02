"""Core caption generation engine"""

import os
import time
import json
from datetime import datetime
from openai import OpenAI
from .prompts import build_prompt, build_hashtag_prompt
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler("logs/server.log"), logging.StreamHandler()]
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_captions(business_type: str, post_description: str, vibe: str = "smooth") -> dict:
    """
    Generate 5 caption variations + hashtags
    
    Returns:
        {
            "captions": ["caption 1", "caption 2", ...],
            "hashtags": "#tag1 #tag2 #tag3...",
            "generation_time": 2.3,
            "timestamp": "2025-01-15T10:30:00Z"
        }
    """
    start = time.time()
    
    try:
        # Generate captions
        caption_prompt = build_prompt(business_type, post_description, vibe)
        
        caption_response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": caption_prompt["system"]},
                {"role": "user", "content": caption_prompt["user"]}
            ],
            temperature=0.9,
            max_tokens=300
        )
        
        raw_captions = caption_response.choices[0].message.content
        captions = parse_numbered_captions(raw_captions)
        
        # Generate hashtags
        hashtag_prompt = build_hashtag_prompt(business_type, post_description)
        
        hashtag_response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": hashtag_prompt["system"]},
                {"role": "user", "content": hashtag_prompt["user"]}
            ],
            temperature=0.7,
            max_tokens=200
        )
        
        hashtags = hashtag_response.choices[0].message.content.strip()
        hashtags = " ".join([tag for tag in hashtags.split() if tag.startswith("#")])
        
        generation_time = round(time.time() - start, 2)
        
        result = {
            "success": True,
            "captions": captions,
            "hashtags": hashtags,
            "generation_time": generation_time,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "business_type": business_type,
            "vibe": vibe
        }
        
        log_generation(result, post_description)
        
        return result
        
        logging.exception("Error in generate_captions (business_type=%r, vibe=%r): %s", business_type, vibe, post_description)
    except Exception as e:
        return {
            "success": False,
            "error": "Internal server error.",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

def parse_numbered_captions(raw: str) -> list:
    """Extract captions from numbered list format"""
    lines = raw.strip().split("\n")
    captions = []
    
    for line in lines:
        cleaned = line.strip()
        for prefix in ["1.", "2.", "3.", "4.", "5.", "1)", "2)", "3)", "4)", "5)", "1-", "2-", "3-", "4-", "5-"]:
            if cleaned.startswith(prefix):
                cleaned = cleaned[len(prefix):].strip()
                break
        
        if cleaned and len(cleaned) > 10:
            captions.append(cleaned)
    
    while len(captions) < 5:
        captions.append(captions[-1] if captions else "Fresh post coming soon! 🔥")
    
    return captions[:5]

def log_generation(result: dict, post_description: str):
    """Log to JSONL for analytics"""
    log_entry = {
        "timestamp": result["timestamp"],
        "business_type": result["business_type"],
        "vibe": result["vibe"],
        "post_description": post_description[:100],
        "generation_time": result["generation_time"],
        "success": result["success"]
    }
    
    log_file = "logs/generations.jsonl"
    os.makedirs("logs", exist_ok=True)
    
    with open(log_file, "a") as f:
        f.write(json.dumps(log_entry) + "\n")
