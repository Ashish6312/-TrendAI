import os
import json
from dotenv import load_dotenv
from simple_recommendations import generate_dynamic_recommendations, parse_real_location_data

load_dotenv()

def test_full_reco():
    area = "Arera Hills, Bhopal, India"
    print(f"--- Testing Recommendations for: {area} ---")
    
    # Test parsing
    loc = parse_real_location_data(area)
    print(f"Location Info Parsed: {loc}")
    
    # Test generation
    # Note: Using small delay since it calls multiple APIs
    result = generate_dynamic_recommendations(area, "test@example.com")
    
    if result:
        print("\n✅ SUCCESS: Got recommendation result!")
        if "analysis" in result:
            print(f"Executive Summary: {result['analysis'].get('executive_summary', 'N/A')}")
            print(f"Sources found: {result['analysis'].get('real_time_sources', [])}")
        
        if "recommendations" in result:
            recos = result["recommendations"]
            print(f"Got {len(recos)} recommendations.")
            for i, r in enumerate(recos[:2]):
                print(f"Reco {i+1}: {r.get('title')} - Investment: {r.get('funding_required')}")
    else:
        print("\n❌ FAILED: No result returned.")

if __name__ == "__main__":
    test_full_reco()
