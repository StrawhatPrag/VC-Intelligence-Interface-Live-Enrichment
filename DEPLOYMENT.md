# Deployment Guide - VC Intelligence Platform

## Prerequisites

- GitHub account and repository connected to Vercel
- OpenAI API key (required for enrichment feature)
- Vercel account

## Step 1: Get OpenAI API Key

1. Visit https://platform.openai.com/account/api-keys
2. Sign in with your OpenAI account (create one if needed)
3. Click "Create new secret key"
4. Copy the key (you won't see it again)
5. Store it securely - you'll need it for Vercel

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Connect GitHub Repository**:
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Authorize Vercel to access your GitHub account
   - Select the vc-intelligence repository

2. **Configure Environment Variables**:
   - You'll see an "Environment Variables" section
   - Add the following variable:
     - **Key**: `OPENAI_API_KEY`
     - **Value**: Your OpenAI API key from Step 1
   - Click "Add"

3. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your app will be live at `your-project.vercel.app`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy the project
vercel

# When prompted for environment variables, add:
# OPENAI_API_KEY: your-openai-api-key

# Set production environment variable
vercel env add OPENAI_API_KEY
# Paste your OpenAI API key when prompted
```

## Step 3: Verify Deployment

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Navigate to a company profile
3. Click "Enrich Data" on any company
4. If enrichment works, your deployment is successful!

## Troubleshooting

### Issue: "Enrichment service not configured"

**Solution**: The `OPENAI_API_KEY` environment variable is not set.

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add `OPENAI_API_KEY` with your OpenAI API key
4. Redeploy the project (or wait for automatic rebuild)

### Issue: "Authentication failed" / "Invalid API key"

**Solution**: Your OpenAI API key is invalid or expired.

1. Check your API key at https://platform.openai.com/account/api-keys
2. Create a new key if necessary
3. Update it in Vercel dashboard
4. Redeploy

### Issue: Enrichment is slow (>30 seconds)

**Solution**: This is normal for the first request. Subsequent requests are cached.

- OpenAI API calls typically take 3-5 seconds
- Network latency can add another 1-2 seconds
- If consistently failing, check OpenAI API status: https://status.openai.com

### Issue: 500 error on enrichment

**Solution**: Check Vercel Function logs.

1. Go to Vercel dashboard → your project
2. Click "Deployments" → latest deployment
3. Click "Functions" tab
4. Check logs for `/api/enrich` endpoint
5. Common issues:
   - API key not set (see "service not configured" above)
   - Website not accessible (try a different company)
   - OpenAI service unavailable (try again later)

## Environment Variables Reference

### Required

- **OPENAI_API_KEY**: OpenAI API key for enrichment feature
  - Format: `sk_...` (starts with `sk_`)
  - Get from: https://platform.openai.com/api-keys

### Optional (for future features)

- **SUPABASE_URL**: For persistent data storage
- **SUPABASE_ANON_KEY**: For Supabase client access
- **DATABASE_URL**: For Postgres integration

## Scaling & Limits

### Vercel Limits
- **Function Memory**: 1024 MB (configured in vercel.json)
- **Function Timeout**: 30 seconds for enrichment
- **Concurrent Functions**: Unlimited on Pro plan

### OpenAI Limits
- **Rate Limit**: 3,500 requests per minute (free tier)
- **Token Limit**: ~4,000 tokens per request
- **Cost**: ~$0.01 per enrichment call

For high volume, consider upgrading your OpenAI plan.

## Security Best Practices

1. **Never commit API keys** to Git
   - API keys should only be in `.env.local` locally
   - Set them via Vercel dashboard for production

2. **Rotate API keys regularly**
   - Create new keys periodically
   - Delete old keys at https://platform.openai.com/account/api-keys

3. **Monitor API usage**
   - Check OpenAI usage at https://platform.openai.com/account/usage/overview
   - Set spending limits to prevent surprise charges

4. **Use environment-specific keys** (optional)
   - Use different OpenAI API keys for dev/staging/production
   - Easier to debug and rotate separately

## Post-Deployment

### Monitor Performance

1. Check Vercel Analytics: Dashboard → Analytics
2. Monitor OpenAI API usage: https://platform.openai.com/account/usage/overview
3. Check Vercel Function logs for errors

### Update the App

1. Make changes locally
2. Commit to GitHub
3. Push to main branch
4. Vercel automatically rebuilds and deploys

### Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain (e.g., `vc-intelligence.com`)
3. Follow DNS configuration instructions
4. Domain should be live within 24 hours

## Rollback to Previous Deployment

If something goes wrong:

1. Go to Vercel dashboard → Deployments
2. Find the previous working deployment
3. Click the three-dot menu
4. Select "Promote to Production"

## Getting Help

- **Vercel Documentation**: https://vercel.com/docs
- **OpenAI API Issues**: https://platform.openai.com/docs
- **GitHub Issues**: Submit issues in your repository
- **Status Pages**:
  - Vercel: https://www.vercel-status.com
  - OpenAI: https://status.openai.com

## Next Steps

After successful deployment:

1. **Add authentication** with Auth.js for user accounts
2. **Connect Supabase** for data persistence
3. **Enable analytics** for user insights
4. **Configure custom domain** with your brand
5. **Set up monitoring** with Sentry or similar
6. **Add team collaboration** features for investor teams
