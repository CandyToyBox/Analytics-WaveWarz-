# WaveWarz Farcaster Webhooks Setup Guide

This guide will help you configure Supabase webhooks to power your WaveWarz Farcaster mini app with real-time battle updates.

## 🎯 Overview

The webhook system enables:
- **Real-time battle notifications** when new battles are created
- **Automatic Farcaster Frame updates** when battle stats change
- **Event-driven architecture** for scalable analytics
- **Live stats** for the mini app

## 📋 Prerequisites

- ✅ Supabase project with webhooks enabled
- ✅ Deployed API server (or ngrok for local testing)
- ✅ Database tables: `battles`, `trader_snapshots`, `artist_leaderboard`, `trader_leaderboard`

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Your Supabase credentials
VITE_SUPABASE_URL=https://gshwqoplsxgqbdkssoit.supabase.co
VITE_SUPABASE_KEY=your-anon-key

# API Server
PORT=3001

# Production URLs (for deployment)
FRAME_BASE_URL=https://your-api-domain.com
APP_URL=https://your-app-domain.com
```

### Step 3: Start the API Server

For local development:
```bash
# Start both frontend and API server
npm run dev:all

# Or just the API server
npm run dev:api
```

For production:
```bash
npm run build:api
npm run start:api
```

### Step 4: Expose Local Server (for testing)

If testing locally, use ngrok to expose your server:

```bash
ngrok http 3001
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

## 🔗 Supabase Webhook Configuration

### Webhook 1: New Battle Created

**Purpose:** Trigger when a new battle is inserted into the database

1. Open your Supabase Dashboard
2. Navigate to **Database** → **Webhooks**
3. Click **Create a new webhook**
4. Fill in the form:

**General Settings:**
- **Name:** `new-battle-webhook` (no spaces!)
- **Table:** `battles`
- **Events:** ✅ Insert
- **Type of webhook:** HTTP Request

**HTTP Request Settings:**
- **Method:** POST
- **URL:** `https://your-domain.com/api/webhooks/battles`
  - For local testing: `https://abc123.ngrok.io/api/webhooks/battles`
- **HTTP Headers:** (Optional)
  - Key: `Content-Type`, Value: `application/json`
  - Key: `X-Webhook-Secret`, Value: `your-secret-here`

**HTTP Parameters:**
- Leave empty for now

5. Click **Create webhook**

### Webhook 2: Battle Stats Updated (Optional)

For real-time updates when pool balances change:

- **Name:** `battle-update-webhook`
- **Table:** `battles`
- **Events:** ✅ Update
- **URL:** Same as above

## 🧪 Testing Your Webhook

### Test 1: Check Server Health

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-25T..."
}
```

### Test 2: Manual Webhook Test

Send a test webhook payload:

```bash
curl -X POST http://localhost:3001/api/webhooks/battles \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INSERT",
    "table": "battles",
    "record": {
      "battle_id": "123456",
      "artist1_name": "Test Artist A",
      "artist2_name": "Test Artist B",
      "status": "active",
      "artist1_pool": 10.5,
      "artist2_pool": 8.3
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Webhook processed",
  "type": "INSERT"
}
```

### Test 3: Trigger from Supabase

Insert a test battle in Supabase SQL Editor:

```sql
INSERT INTO battles (
  battle_id,
  artist1_name,
  artist2_name,
  status,
  artist1_pool,
  artist2_pool,
  created_at
) VALUES (
  '999999',
  'Webhook Test A',
  'Webhook Test B',
  'active',
  0,
  0,
  NOW()
);
```

Check your API server logs for:
```
📥 Received webhook: { type: 'INSERT', table: 'battles', battleId: '999999' }
🆕 New battle created: ...
```

## 🖼️ Farcaster Frame Endpoints

Your API server provides these endpoints for Farcaster Frames:

### Frame URLs

- **Latest Battle Frame:** `https://your-domain.com/api/frames/battle`
- **Specific Battle:** `https://your-domain.com/api/frames/battle/123456`
- **Battle Image:** `https://your-domain.com/api/frames/battle/image?battleId=123456`

### Testing the Frame

1. Visit the frame URL in your browser:
   ```
   http://localhost:3001/api/frames/battle
   ```

2. View the HTML source - you should see Frame meta tags:
   ```html
   <meta property="fc:frame" content="vNext" />
   <meta property="fc:frame:image" content="..." />
   <meta property="fc:frame:button:1" content="🔄 Refresh Stats" />
   ```

3. To test in Farcaster:
   - Deploy your API to production (Vercel, Railway, etc.)
   - Share the frame URL in Warpcast
   - The frame should render with interactive buttons

## 📊 Webhook Payload Reference

### INSERT Event (New Battle)

```json
{
  "type": "INSERT",
  "table": "battles",
  "schema": "public",
  "record": {
    "id": "uuid-here",
    "battle_id": "174523",
    "created_at": "2025-11-25T...",
    "status": "active",
    "artist1_name": "Artist A",
    "artist2_name": "Artist B",
    "artist1_wallet": "wallet-address-a",
    "artist2_wallet": "wallet-address-b",
    "artist1_pool": 0,
    "artist2_pool": 0,
    "image_url": "https://...",
    "battle_duration": 3600,
    "winner_decided": false
  }
}
```

### UPDATE Event (Stats Changed)

```json
{
  "type": "UPDATE",
  "table": "battles",
  "schema": "public",
  "record": {
    "battle_id": "174523",
    "artist1_pool": 15.75,
    "artist2_pool": 12.30,
    ...
  },
  "old_record": {
    "battle_id": "174523",
    "artist1_pool": 10.50,
    "artist2_pool": 8.30,
    ...
  }
}
```

## 🔒 Security Best Practices

### 1. Webhook Secret Validation (Recommended)

Add secret validation to your webhook handler:

```typescript
// In api/webhooks/battles.ts
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export async function battleWebhookHandler(req: Request, res: Response) {
  const providedSecret = req.headers['x-webhook-secret'];

  if (WEBHOOK_SECRET && providedSecret !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ... rest of handler
}
```

### 2. IP Whitelisting

Restrict webhook access to Supabase IPs only (configure in your hosting provider).

### 3. HTTPS Only

Always use HTTPS in production. Never expose webhook endpoints over HTTP.

## 🚢 Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel Dashboard

4. Update Supabase webhook URL to your Vercel URL

### Option 2: Railway

1. Connect your GitHub repo to Railway
2. Set environment variables
3. Deploy automatically on push

### Option 3: Any Node.js Host

Build and deploy:
```bash
npm run build:api
npm run start:api
```

## 📝 Troubleshooting

### Webhook Not Triggering

1. **Check webhook is enabled** in Supabase Dashboard
2. **Verify URL is correct** and accessible
3. **Check Supabase logs** in Dashboard → Database → Webhooks
4. **Test with curl** to verify endpoint works
5. **Check your server logs** for errors

### Frame Not Displaying in Farcaster

1. **Verify meta tags** are correct (view HTML source)
2. **Check image URL** is accessible (must be HTTPS in production)
3. **Use Frame Validator:** https://warpcast.com/~/developers/frames
4. **Ensure base URL** is set correctly in .env

### Connection Errors

1. **Verify Supabase credentials** in .env
2. **Check network access** - some hosts block Supabase
3. **Test connection:**
   ```bash
   curl "https://your-project.supabase.co/rest/v1/battles?limit=1" \
     -H "apikey: your-anon-key"
   ```

## 📚 Next Steps

Now that webhooks are set up:

1. ✅ **Customize webhook handlers** in `api/webhooks/battles.ts`
2. ✅ **Enhance Frame design** in `api/frames/battle-frame.ts`
3. ✅ **Add Farcaster posting** to announce new battles
4. ✅ **Implement caching** for better performance
5. ✅ **Add analytics tracking** for webhook events

## 🔗 Resources

- [Supabase Webhooks Docs](https://supabase.com/docs/guides/database/webhooks)
- [Farcaster Frames Spec](https://docs.farcaster.xyz/reference/frames/spec)
- [Warpcast Frame Validator](https://warpcast.com/~/developers/frames)

## 💡 Tips

- Use **ngrok** for local webhook testing
- Monitor webhook logs in **Supabase Dashboard**
- Test frames with **Frame Validator** before sharing
- Keep webhook handlers **fast and async**
- Cache frequently accessed data to reduce database calls

---

Need help? Check the API server logs or file an issue in the repo!
