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

// Deterministic signal engine - hard logic based on website patterns
function extractDeterministicSignals(html: string): Array<{ type: string; detail: string; confidence: number; source: string }> {
  const signals = []
  const lowerHtml = html.toLowerCase()

  // Hiring activity
  if (lowerHtml.includes('/careers') || lowerHtml.includes('join our team') || lowerHtml.includes('we\'re hiring')) {
    signals.push({
      type: 'Hiring Activity',
      detail: 'Active careers page detected',
      confidence: 0.95,
      source: 'website',
    })
  }

  // Content/thought leadership engine
  if (lowerHtml.includes('/blog') || lowerHtml.includes('latest posts') || lowerHtml.includes('insights') || lowerHtml.includes('resources')) {
    signals.push({
      type: 'Content Engine',
      detail: 'Blog or resources section present',
      confidence: 0.9,
      source: 'website',
    })
  }

  // Commercial intent
  if (lowerHtml.includes('/pricing') || lowerHtml.includes('pricing page') || lowerHtml.includes('plans') && lowerHtml.includes('$')) {
    signals.push({
      type: 'Commercial Intent',
      detail: 'Pricing page available',
      confidence: 0.9,
      source: 'website',
    })
  }

  // Developer focus
  if (lowerHtml.includes('docs.') || lowerHtml.includes('/docs') || lowerHtml.includes('api reference') || lowerHtml.includes('sdk')) {
    signals.push({
      type: 'Developer Focus',
      detail: 'Developer documentation detected',
      confidence: 0.85,
      source: 'website',
    })
  }

  // Community
  if (lowerHtml.includes('discord') || lowerHtml.includes('community') || lowerHtml.includes('slack') || lowerHtml.includes('github')) {
    signals.push({
      type: 'Community Building',
      detail: 'Active community presence',
      confidence: 0.8,
      source: 'website',
    })
  }

  // Product maturity (changelog, roadmap)
  if (lowerHtml.includes('changelog') || lowerHtml.includes('roadmap') || lowerHtml.includes('releases')) {
    signals.push({
      type: 'Product Maturity',
      detail: 'Public changelog or roadmap',
      confidence: 0.85,
      source: 'website',
    })
  }

  return signals
}

// Thesis matching - compute alignment with investor thesis
function computeThesisMatch(keywords: string[], thesis: string | null): { score: number; reasons: string[] } {
  if (!thesis) {
    return { score: 0, reasons: [] }
  }

  const thesisTokens = thesis.toLowerCase().split(/\s+/).filter(t => t.length > 2)
  const matches = keywords.filter(k => {
    const keywordLower = k.toLowerCase()
    return thesisTokens.some(token => keywordLower.includes(token) || token.includes(keywordLower))
  })

  return {
    score: Math.min(100, matches.length * 20),
    reasons: matches,
  }
}

async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    // Add protocol if missing
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    
    const response = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VCIntelligence/1.0)',
      },
      signal: AbortSignal.timeout(10000),
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
    const prompt = `You are an institutional VC analyst. Extract structured intelligence from the company website.

Company Name: ${companyName}
Website Content: ${websiteContent || 'No website content available'}

Be concise. Avoid marketing language. Focus on business model, ICP, and signals of traction.

Return ONLY valid JSON:
{
  "summary": "One sentence executive summary of what they do",
  "whatTheyDo": "Three key business capabilities as a bullet list. Format as 'Capability 1\\nCapability 2\\nCapability 3'. Be specific about what they build/offer.",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "signals": [
    {"type": "signal_name", "confidence": 0.85, "detail": "specific detail"},
    {"type": "signal_name", "confidence": 0.72, "detail": "specific detail"},
    {"type": "signal_name", "confidence": 0.68, "detail": "specific detail"}
  ]
}

Ensure keywords are specific (e.g. "AI infrastructure" not "AI"). Signals should be based on observable facts from the website.`

    const { text } = await generateText({
      model: openai('gpt-4o-mini') as any,
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
      responseFormat: { type: 'json_object' },
    } as any)

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

    const { website, company_name, thesis } = await request.json()

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

    // Extract deterministic signals from HTML
    const deterministicSignals = extractDeterministicSignals(websiteContent)
    console.log(`[v0] Extracted ${deterministicSignals.length} deterministic signals`)

    // Enrich with AI analysis
    const enrichedData = await enrichCompanyWithAI(company_name, websiteContent)

    // Merge deterministic signals with AI signals
    const allSignals = [
      ...deterministicSignals.map(s => ({
        type: s.type,
        confidence: s.confidence,
        timestamp: new Date().toISOString(),
        detail: s.detail,
        source: s.source,
      })),
      ...enrichedData.signals.map((s: any) => ({
        ...s,
        timestamp: new Date().toISOString(),
      })),
    ]

    // Compute thesis match if thesis provided
    const thesisMatch = computeThesisMatch(enrichedData.keywords, thesis || null)

    // Add sources
    const sources = [
      {
        url: website.startsWith('http') ? website : `https://${website}`,
        title: `${company_name} - Official Website`,
        timestamp: new Date().toISOString(),
      },
    ]

    // Add Crunchbase and LinkedIn as reference sources
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
      summary: enrichedData.summary,
      whatTheyDo: enrichedData.whatTheyDo,
      keywords: enrichedData.keywords,
      signals: allSignals,
      thesisMatch: thesisMatch.score > 0 ? thesisMatch : null,
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
