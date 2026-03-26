import os
import re

file_path = r'e:\TrendAI-main\api\integrated_business_intelligence.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern 1: self.gemini_key[:8] -> str(self.gemini_key or "")[:8]
content = re.sub(r'self\.gemini_key\[:8\]', r'str(self.gemini_key or "")[:8]', content)
# Pattern 2: self.serp_key[:8] -> str(self.serp_key or "")[:8]
content = re.sub(r'self\.serp_key\[:8\]', r'str(self.serp_key or "")[:8]', content)
# Pattern 3: area_chars[:5] -> area_chars[:5] (if area_chars is known to be str)
# Actually, the lint error specifically mentioned 152 col 44.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Indexing patterns fixed.")
