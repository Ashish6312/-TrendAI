import praw
import os
from duckduckgo_search import DDGS
from dotenv import load_dotenv

load_dotenv()

def test_reddit():
    print("Testing Reddit...")
    try:
        reddit = praw.Reddit(
            client_id=os.getenv("REDDIT_CLIENT_ID"),
            client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
            password=os.getenv("REDDIT_PASSWORD"),
            user_agent="TrendAI Test 1.0",
            username=os.getenv("REDDIT_USERNAME"),
        )
        print(f"Logged in as: {reddit.user.me()}")
        for submission in reddit.subreddit("all").search("Bhopal business", limit=2):
            print(f"- {submission.title}")
    except Exception as e:
        print(f"Reddit Failed: {e}")

def test_ddgs():
    print("Testing DDGS...")
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text("Bhopal market trends 2025", max_results=2))
            print(f"- {results[0]['title']}")
    except Exception as e:
        print(f"DDGS Failed: {e}")

if __name__ == "__main__":
    test_reddit()
    test_ddgs()
