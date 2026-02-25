import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

// In-memory cache for enrichment results (session-based)
// In production, replace with Redis or database
const enrichmentCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 3600000 // 1 hour in milliseconds

function getCacheKey(website: string, companyName: string): string {
  return `${companyName}:${website}`.toLowerCase()
}

function getFromCache(key: string): any | null {
  const cached = enrichmentCache.get(key)
  if (!cached) return null
  
  // Check if cache has expired
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    enrichmentCache.delete(key)
    return null
  }
  
  return cached.data
}

function setInCache(key: string, data: any): void {
  enrichmentCache.set(key, { data, timestamp: Date.now() })
}

async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    // Add protocol if missing
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    
    const response = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VCIntelligence/1.0)',
      },
      timeout: 10000,
    })

    if (!response.ok) {
      console.warn(`[v0] Failed to fetch ${fullUrl}: ${response.status}`)
      return ''
    }

    const html = await response.text()
    
    // Aggressive HTML cleaning - remove all scripts, styles, and tags
    let cleaned = html
      // Remove script tags and content
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      // Remove style tags and content
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      // Remove comments
      .replace(/<!--[\s\S]*?-->/g, ' ')
      // Remove all HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim()

    // Trim to safe size for API (15KB of text should be plenty for analysis)
    const maxChars = 15000
    const trimmed = cleaned.slice(0, maxChars)

    console.log(`[v0] Fetched and cleaned content: ${trimmed.length} chars from ${fullUrl}`)
    return trimmed
  } catch (error) {
    console.error(`[v0] Error fetching website:`, error)
    return ''
  }
}

async function enrichCompanyWithAI(
  companyName: string,
  websiteContent: string
) {
  try {
    const prompt = `You are a VC research analyst. Analyze the following information about a company and provide structured intelligence in valid JSON format.

Company Name: ${companyName}
Website Content: ${websiteContent || 'No website content available'}

Return ONLY valid JSON with this exact structure:
{
  "summary": "A 2-3 sentence executive summary of what the company does and their market position",
  "whatTheyDo": "A detailed 2-3 sentence description of the company's core business model, products/services, and value proposition",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "signals": [
    {"type": "signal_type_1", "confidence": 0.85},
    {"type": "signal_type_2", "confidence": 0.72},
    {"type": "signal_type_3", "confidence": 0.68}
  ]
}

Focus signals on: market traction, innovation indicators, team strength, growth momentum. Ensure all values are strings except confidence values which are numbers between 0 and 1.`

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
      responseFormat: { type: 'json_object' },
    })

    // Parse the JSON response (guaranteed to be valid JSON due to response_format)
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch (parseError) {
      console.error('[v0] JSON parse error:', parseError, 'Raw text:', text)
      throw new Error('Failed to parse AI response as JSON')
    }

    return {
      summary: parsed.summary || '',
      whatTheyDo: parsed.whatTheyDo || '',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      signals: Array.isArray(parsed.signals)
        ? parsed.signals.map((s: any) => ({
            type: s.type || 'Unknown Signal',
            confidence: Math.min(Math.max(s.confidence || 0, 0), 1),
            timestamp: new Date().toISOString(),
          }))
        : [],
    }
  } catch (error) {
    console.error('AI enrichment error:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Enrichment service not configured. Please set OPENAI_API_KEY.' },
        { status: 503 }
      )
    }

    const { website, company_name } = await request.json()

    if (!website || !company_name) {
      return NextResponse.json(
        { error: 'Missing website or company_name parameter' },
        { status: 400 }
      )
    }

    // Check cache first to avoid redundant API calls
    const cacheKey = getCacheKey(website, company_name)
    const cachedResult = getFromCache(cacheKey)
    
    if (cachedResult) {
      console.log(`[v0] Returning cached enrichment for ${company_name}`)
      return NextResponse.json(cachedResult)
    }

    console.log(`[v0] Cache miss for ${company_name}, fetching fresh enrichment...`)

    // Fetch real website content
    const websiteContent = await fetchWebsiteContent(website)

    // Enrich with AI analysis
    const enrichedData = await enrichCompanyWithAI(company_name, websiteContent)

    // Add sources
    const sources = [
      {
        url: website.startsWith('http') ? website : `https://${website}`,
        title: `${company_name} - Official Website`,
        timestamp: new Date().toISOString(),
      },
    ]

    // Add Crunchbase and LinkedIn as reference sources if available
    sources.push({
      url: `https://www.crunchbase.com/search/organizations?query=${encodeURIComponent(company_name)}`,
      title: `${company_name} - Crunchbase Profile`,
      timestamp: new Date().toISOString(),
    })

    sources.push({
      url: `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(company_name)}`,
      title: `${company_name} - LinkedIn Search`,
      timestamp: new Date().toISOString(),
    })

    const result = {
      ...enrichedData,
      sources,
    }

    // Cache the result for future requests
    setInCache(cacheKey, result)
    console.log(`[v0] Enrichment cached for ${company_name}`)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] Enrichment error:', error)

    // Check if it's an API key error
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('API') || errorMessage.includes('401') || errorMessage.includes('authentication')) {
      return NextResponse.json(
        { error: 'Authentication failed. Please check your OPENAI_API_KEY.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to enrich company data. Please try again.' },
      { status: 500 }
    )
  }
}
