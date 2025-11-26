#!/bin/bash

echo "🧪 Testing Signup API..."
echo ""

# Test signup
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "12345678",
    "name": "Test User"
  }')

echo "Response:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
echo ""

# Check if success
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Signup successful!"
  echo ""
  echo "Now test login at http://localhost:3000/auth/login"
  echo "Email: testuser@example.com"
  echo "Password: 12345678"
else
  echo "❌ Signup failed!"
  echo ""
  echo "Error details:"
  echo "$RESPONSE" | jq '.error' 2>/dev/null || echo "$RESPONSE"
fi
