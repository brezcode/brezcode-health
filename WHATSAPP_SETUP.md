# 📱 WhatsApp Business API Setup Guide

## ✅ Current Status: API Integrated, Awaiting Phone Number Verification

### 🎯 What's Already Working:
- ✅ WhatsApp Business API credentials configured
- ✅ Server endpoints for WhatsApp signup and verification
- ✅ WhatsApp message sending functionality
- ✅ Webhook endpoints for receiving messages
- ✅ Verification code system

### 🚧 Current Limitation:
The WhatsApp Business API is in **development mode**, which means:
- Messages can only be sent to **verified phone numbers**
- You need to add test phone numbers to the allowed list

## 🔧 API Endpoints Added:

### WhatsApp Authentication Endpoints:
```javascript
POST /api/auth/signup-whatsapp
// Body: { firstName, lastName, phoneNumber, password, quizAnswers }

POST /api/auth/verify-whatsapp  
// Body: { phoneNumber, code }

POST /api/auth/resend-whatsapp-verification
// Body: { phoneNumber }
```

### WhatsApp Webhook Endpoints:
```javascript
GET /webhook/whatsapp
// Webhook verification for Meta

POST /webhook/whatsapp
// Receives WhatsApp messages
```

## 🔑 Environment Variables Configured:
```env
META_ACCESS_TOKEN=EAASbrygmYVMBP...
META_PHONE_NUMBER_ID=761519707040662
META_BUSINESS_ACCOUNT_ID=946351337637439
META_VERIFY_TOKEN=brezcode-health-2024
```

## 🚀 Next Steps to Enable WhatsApp:

### Option 1: Add Test Phone Numbers (Development)
1. Go to Meta Business (business.facebook.com)
2. Navigate to your WhatsApp Business API app
3. Go to "WhatsApp" > "API Setup"
4. Add test phone numbers to the recipient list
5. Verify phone numbers via SMS

### Option 2: Submit for App Review (Production)
1. Complete app review process with Meta
2. Get production approval
3. Enable sending to any phone number

## 🧪 Testing Commands:

```bash
# Test WhatsApp signup flow
npm run test-whatsapp-signup

# Test individual WhatsApp functionality  
npm run test-whatsapp

# Start server to receive webhooks
npm run start
```

## 📱 Test Phone Number Format:
- Use international format: `+1234567890`
- Must be added to Meta Business recipient list first

## 🔄 User Flow (WhatsApp):
1. User chooses "Sign up with WhatsApp"
2. Enters phone number instead of email
3. Receives verification code via WhatsApp
4. Enters code to complete verification
5. Account is activated

## 🛠️ Technical Implementation:

### Server Features:
- WhatsApp message sending via Graph API
- 6-digit verification codes
- 15-minute code expiry
- Rate limiting (5 attempts max)
- Webhook message handling

### Security:
- Webhook verification with verify token
- API credentials in environment variables
- No sensitive data in code commits

## 📊 Current API Status:
- **Status Code:** 400 (Expected - phone not in allowed list)
- **Error:** `#131030 Recipient phone number not in allowed list`
- **Solution:** Add test numbers to Meta Business recipient list

## 🎯 Integration Complete:
The WhatsApp Business API is fully integrated and ready to use once test phone numbers are added or the app is approved for production use.

---
**Last Updated:** 2025-08-21  
**Status:** 🟡 Integration Complete, Awaiting Number Verification  
**Next Action:** Add test phone numbers to Meta Business recipient list