# 📡 Meta WhatsApp Webhook Configuration Guide

## 🚀 Step 1: Railway Deployment (✅ COMPLETED)
Your code has been pushed to GitHub and should auto-deploy to Railway.

## 🔧 Step 2: Configure Meta Business Webhook

### 1. **Get Your Railway App URL**
- Go to [Railway Dashboard](https://railway.app/dashboard)
- Find your `brezcode-health` project
- Copy the public URL (e.g., `https://brezcode-health-production.up.railway.app`)

### 2. **Configure WhatsApp Webhook in Meta Business**

#### Go to Meta Business Manager:
1. Visit [business.facebook.com](https://business.facebook.com)
2. Navigate to your WhatsApp Business API app
3. Go to **WhatsApp** > **Configuration**

#### Set Webhook URL:
```
Callback URL: https://your-railway-app.up.railway.app/webhook/whatsapp
Verify Token: brezcode-health-2024
```

#### Subscribe to Webhook Events:
✅ **messages** - Receive incoming messages  
✅ **message_deliveries** - Message delivery status  
✅ **message_reads** - Message read receipts  

### 3. **Webhook Verification Process**
When you save the webhook URL, Meta will:

1. Send GET request to: `https://your-app.up.railway.app/webhook/whatsapp`
2. Include parameters:
   - `hub.mode=subscribe`
   - `hub.verify_token=brezcode-health-2024` 
   - `hub.challenge=random_string`

3. Your server responds with the challenge value ✅

## 🔑 Required Environment Variables on Railway

Ensure these are set in Railway dashboard:

```env
# WhatsApp Business API
META_ACCESS_TOKEN=your_meta_access_token_here
META_PHONE_NUMBER_ID=your_phone_number_id_here
META_BUSINESS_ACCOUNT_ID=your_business_account_id_here
META_VERIFY_TOKEN=your_verify_token_here

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=your_email@domain.com
FROM_NAME=BrezCode Health

# Server
PORT=3002
NODE_ENV=production
```

## 🧪 Step 3: Test Webhook Configuration

### 1. **Verify Webhook URL**
Test the endpoint manually:
```bash
curl "https://your-railway-app.up.railway.app/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=brezcode-health-2024&hub.challenge=test123"
```
Should return: `test123`

### 2. **Test Message Receiving**
Send a WhatsApp message to your business number. Check Railway logs for:
```
📱 Received WhatsApp message: { from: "+1234567890", ... }
```

## 🔄 Step 4: Enable Message Sending

### Add Test Numbers (Development Mode):
1. In Meta Business Manager
2. Go to **WhatsApp** > **API Setup**
3. Click **Add Recipient**
4. Add phone numbers that can receive test messages
5. Verify each number via SMS

### Or Apply for Production:
1. Complete App Review with Meta
2. Submit business verification
3. Get approval to send to any number

## 🎯 Final Configuration Checklist

- ✅ Railway app deployed and accessible
- ✅ Webhook URL configured in Meta Business
- ✅ Verify token matches (`brezcode-health-2024`)
- ✅ Environment variables set on Railway
- ✅ Webhook verification successful
- ✅ Test phone numbers added (for development)

## 📱 Testing the Full Flow

Once configured, test the complete WhatsApp verification:

```bash
# Test WhatsApp signup (should work after webhook setup)
curl -X POST https://your-railway-app.up.railway.app/api/auth/signup-whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "phoneNumber": "+1234567890",
    "password": "TestPassword123!"
  }'
```

## 🚨 Common Issues & Solutions

**Issue:** Webhook verification fails  
**Solution:** Check that `META_VERIFY_TOKEN=brezcode-health-2024` exactly matches

**Issue:** Can't send messages to phone numbers  
**Solution:** Add numbers to recipient list in Meta Business Manager

**Issue:** Environment variables not loading  
**Solution:** Verify all variables are set in Railway dashboard

---
**Status:** 🟡 Ready for webhook configuration  
**Next:** Configure webhook URL in Meta Business Manager