"""Check how CORS_ORIGINS is being parsed."""

import sys
sys.path.insert(0, '.')

from app.config.settings import Settings
import json

print("=== Checking CORS_ORIGINS Parsing ===")

# Check what Settings actually gets
settings = Settings()
print(f"\n1. settings.CORS_ORIGINS: {settings.CORS_ORIGINS}")
print(f"   Type: {type(settings.CORS_ORIGINS)}")
print(f"   Is list? {isinstance(settings.CORS_ORIGINS, list)}")

# Check individual values
print("\n2. Individual origins:")
for origin in settings.CORS_ORIGINS:
    print(f"   - '{origin}' (type: {type(origin)})")

# Check if http://localhost:5173 is in the list
frontend_origin = "http://localhost:5173"
print(f"\n3. Is '{frontend_origin}' in CORS_ORIGINS? {frontend_origin in settings.CORS_ORIGINS}")

# Check the actual .env file content
print("\n4. Checking .env file:")
with open('.env', 'r') as f:
    for line in f:
        if 'CORS_ORIGINS' in line:
            print(f"   Found: {line.strip()}")
            # Try to parse it manually
            if '=' in line:
                key, value = line.strip().split('=', 1)
                print(f"   Raw value: {value}")
                print(f"   Value type: {type(value)}")
                
                # Try different parsing methods
                print("\n   Parsing attempts:")
                
                # Method 1: JSON parse
                try:
                    parsed_json = json.loads(value)
                    print(f"   JSON parse: {parsed_json} (type: {type(parsed_json)})")
                except json.JSONDecodeError as e:
                    print(f"   JSON parse failed: {e}")
                
                # Method 2: eval (dangerous, but for testing)
                try:
                    parsed_eval = eval(value)
                    print(f"   eval parse: {parsed_eval} (type: {type(parsed_eval)})")
                except Exception as e:
                    print(f"   eval parse failed: {e}")

print("\n=== Summary ===")
if frontend_origin in settings.CORS_ORIGINS:
    print("✅ CORS_ORIGINS contains http://localhost:5173")
    print("✅ Pydantic is parsing the .env value correctly")
else:
    print("❌ CORS_ORIGINS does NOT contain http://localhost:5173")
    print("❌ There's likely a parsing issue with the .env file")