# VC Intelligence - API Documentation

## Enrichment Endpoint

### Overview

The enrichment API (`POST /api/enrich`) provides real-time, AI-powered company intelligence by:

1. Fetching live website content from the company's URL
2. Processing the content with OpenAI's GPT-4 model
3. Extracting structured intelligence including business model, market signals, and keywords
4. Returning source citations and confidence scores

This is a **production-grade implementation** that safely handles API keys server-side and performs real data analysis.

### Endpoint Details

**URL**: `POST /api/enrich`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "website": "example.com",
  "company_name": "Example Corp"
}
```

**Parameters**:
- `website` (string, required): Company website URL (with or without protocol)
- `company_name` (string, required): Official company name

### Response Format

**Success (200)**:
```json
{
  "summary": "2-3 sentence executive summary of the company",
  "whatTheyDo": "Detailed description of business model and offerings",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "signals": [
    {
      "type": "Signal type (e.g., Recent Funding, Market Expansion)",
      "confidence": 0.92,
      "timestamp": "2025-02-25T10:30:00Z"
    }
  ],
  "sources": [
    {
      "url": "https://example.com",
      "title": "Source title",
      "timestamp": "2025-02-25T10:30:00Z"
    }
  ]
}
```

**Error - Missing API Key (503)**:
```json
{
  "error": "Enrichment service not configured. Please set OPENAI_API_KEY."
}
```

**Error - Missing Parameters (400)**:
```json
{
  "error": "Missing website or company_name parameter"
}
```

**Error - Authentication Failed (401)**:
```json
{
  "error": "Authentication failed. Please check your OPENAI_API_KEY."
}
```

**Error - Processing Failed (500)**:
```json
{
  "error": "Failed to enrich company data. Please try again."
}
```

### Implementation Details

#### Website Scraping

The API safely fetches website content with:
- User-Agent identification as VCIntelligence/1.0
- 10-second timeout to prevent hanging
- Script and style tag removal for clean text extraction
- 3000-character limit to fit within AI token limits

#### AI Analysis

Uses OpenAI's `gpt-4o-mini` model to analyze the website content and generate:

- **Summary**: Executive overview of company positioning
- **What They Do**: Business model and value proposition
- **Keywords**: Up to 5 key terms describing the company
- **Signals**: Investment signals with confidence scores
  - Recent funding activity
  - Market expansion indicators
  - Innovation markers
  - Growth momentum signals

#### Security Measures

1. **Server-Side Processing**: All API calls and processing happen on the server
2. **No Client Exposure**: API keys never reach the browser
3. **Environment Variables**: Credentials stored in `.env.local` (git-ignored)
4. **Error Handling**: Detailed error messages for debugging, generic messages to clients

### Usage Examples

#### JavaScript/TypeScript (Client-Side)

```typescript
async function enrichCompany(website: string, companyName: string) {
  const response = await fetch('/api/enrich', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      website,
      company_name: companyName,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return await response.json()
}

// Usage
const enrichedData = await enrichCompany('openai.com', 'OpenAI')
console.log(enrichedData.summary)
```

#### cURL

```bash
curl -X POST http://localhost:3000/api/enrich \
  -H "Content-Type: application/json" \
  -d '{
    "website": "openai.com",
    "company_name": "OpenAI"
  }'
```

#### Python

```python
import requests

response = requests.post(
    'http://localhost:3000/api/enrich',
    json={
        'website': 'openai.com',
        'company_name': 'OpenAI'
    }
)

data = response.json()
print(data['summary'])
```

### Rate Limiting & Performance

- **Processing Time**: Typically 3-5 seconds per enrichment
- **API Costs**: ~0.01 USD per enrichment call (GPT-4 pricing)
- **Recommended Rate**: 1-2 enrichments per minute per user
- **Token Usage**: ~800-1200 tokens per request

### Environment Configuration

Required in `.env.local`:

```
OPENAI_API_KEY=sk_your_api_key_here
```

**To get an OpenAI API key**:
1. Go to https://platform.openai.com/api-keys
2. Create a new secret key
3. Add to `.env.local`
4. Restart development server

### Common Issues & Solutions

**Issue**: "Enrichment service not configured"
- **Solution**: Check that `OPENAI_API_KEY` is set in `.env.local` and the dev server has been restarted

**Issue**: "Authentication failed"
- **Solution**: Verify your OpenAI API key is valid and not expired at https://platform.openai.com/api-keys

**Issue**: "Failed to fetch website"
- **Solution**: The website may be blocking automated access. Verify the URL is correct and accessible

**Issue**: Slow enrichment (>10 seconds)
- **Solution**: May indicate network issues or OpenAI API latency. Retry the request

### Integration with UI

The enrichment API is integrated into the Company Profile Sheet. To trigger enrichment:

1. Open any company profile by clicking on a company in the table
2. Navigate to the "Enrichment" tab
3. Click "Enrich Data" button
4. Wait for analysis to complete (3-5 seconds)
5. View results with signals, keywords, and source citations

### Future Enhancements

Potential improvements for production:

- Caching enrichment results to reduce API calls
- Support for alternative AI providers (Groq, Anthropic)
- Batch enrichment for multiple companies
- Webhook notifications when enrichment completes
- Custom AI prompt templates for different analysis types
- Real-time news and signal monitoring
- Email alerts for new signals

### Support & Troubleshooting

For issues:
1. Check the console for error messages
2. Verify environment variables are set
3. Review [OpenAI documentation](https://platform.openai.com/docs)
4. Check API usage at https://platform.openai.com/account/usage/overview
