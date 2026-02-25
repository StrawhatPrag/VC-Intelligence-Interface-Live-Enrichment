import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

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
      console.warn(`Failed to fetch ${fullUrl}: ${response.status}`)
      return ''
    }

    const html = await response.text()
    
    // Extract text content from HTML by removing scripts and styles
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    return text.slice(0, 3000) // Limit to first 3000 chars for analysis
  } catch (error) {
    console.error(`Error fetching website: ${error}`)
    return ''
  }
}

async function enrichCompanyWithAI(
  companyName: string,
  websiteContent: string
) {
  try {
    const prompt = `You are a VC research analyst. Analyze the following information about a company and provide structured intelligence.

Company Name: ${companyName}
Website Content: ${websiteContent || 'No website content available'}

Provide a JSON response with exactly this structure (no markdown, valid JSON only):
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

Focus signals on: market traction, innovation indicators, team strength, growth momentum.`

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from AI response')
    }

    const parsed = JSON.parse(jsonMatch[0])

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

    return NextResponse.json({
      ...enrichedData,
      sources,
    })
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
