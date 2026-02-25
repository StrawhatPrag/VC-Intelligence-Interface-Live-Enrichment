# VC Intelligence - Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
git clone <repository-url>
cd vc-intelligence
pnpm install
```

### 2. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new secret key
3. Copy it (won't show again!)

### 3. Set Environment Variable
```bash
# Create .env.local file
echo "OPENAI_API_KEY=sk_your_key_here" > .env.local
```

### 4. Start Dev Server
```bash
pnpm dev
```

### 5. Open and Test
- Visit http://localhost:3000
- Click any company
- Click "Enrich Data" button
- Wait 3-5 seconds for AI analysis
- Done! ✨

## Key Features to Try

### Explore Companies
- View 20+ companies with mock data
- Filter by funding stage, industry, signals
- Table and card view modes
- Real-time search

### Enrich a Company
- Click on any company profile
- Go to "Enrichment" tab
- Click "Enrich Data" button
- View AI-generated insights:
  - Company summary
  - Business description
  - Key keywords
  - Investment signals
  - Source citations

### Create Lists
- Navigate to "Lists" page
- Create a new list for your sourcing pipeline
- Add/remove companies
- Export as CSV or JSON

### Save Searches
- Filter companies to your criteria
- Save the search for quick access later
- Edit or delete saved searches
- Re-run searches anytime

## Important Files

- **API Endpoint**: `/app/api/enrich/route.ts`
- **Main UI**: `/app/page.tsx`
- **Company Explorer**: `/components/pages/companies-page.tsx`
- **Profile Modal**: `/components/companies/company-profile-sheet.tsx`
- **Mock Data**: `/lib/mock-data.ts`
- **Styling**: `/app/globals.css` (custom design tokens)

## Documentation

- **README.md** - Full project overview
- **API.md** - Enrichment API reference
- **IMPLEMENTATION.md** - Technical deep-dive
- **DEPLOYMENT.md** - Production deployment guide

## Troubleshooting

### "Enrichment service not configured"
- Check `.env.local` has `OPENAI_API_KEY`
- Restart dev server: `pnpm dev`

### "Authentication failed"
- Verify API key is valid
- Check at https://platform.openai.com/account/usage

### Still not working?
1. Check console logs: `pnpm dev` output
2. Try a different company
3. Check OpenAI status: https://status.openai.com

## Development Tips

### Add a New Company
Edit `/lib/mock-data.ts` and add to `MOCK_COMPANIES` array:
```typescript
{
  id: 'new-company',
  name: 'New Company',
  website: 'example.com',
  description: 'What they do',
  // ... other fields
}
```

### Customize Colors
Edit `/app/globals.css` - update the OKLch color values in `:root` and `.dark`

### Change API Model
In `/app/api/enrich/route.ts`, line 67:
```typescript
model: openai('gpt-4o-mini') // Change this to your preferred model
```

## Production Deployment

### Deploy to Vercel
```bash
vercel deploy
```

Then in Vercel dashboard:
1. Settings → Environment Variables
2. Add `OPENAI_API_KEY`
3. Redeploy

See `DEPLOYMENT.md` for detailed steps.

## API Usage

Test the enrichment API directly:

```bash
curl -X POST http://localhost:3000/api/enrich \
  -H "Content-Type: application/json" \
  -d '{
    "website": "vercel.com",
    "company_name": "Vercel"
  }'
```

## Next Steps

After setup, consider:

1. **Connect Supabase** for persistent data storage
2. **Add Auth.js** for user authentication
3. **Enable analytics** to track usage
4. **Custom domain** for your brand
5. **Team collaboration** features for investor groups

## Resources

- Next.js Docs: https://nextjs.org/docs
- Vercel AI SDK: https://sdk.vercel.ai
- OpenAI API: https://platform.openai.com/docs
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com

## Support

- Check documentation files in repo root
- Review API error messages for specific issues
- Monitor OpenAI usage: https://platform.openai.com/account/usage

**Happy sourcing! 🚀**
