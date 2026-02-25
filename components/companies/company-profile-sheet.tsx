'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Company } from '@/lib/types'
import {
  BookmarkCheck,
  Bookmark,
  Share2,
  ExternalLink,
  Zap,
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Sparkles,
  Globe,
} from 'lucide-react'

interface CompanyProfileSheetProps {
  company: Company
  isOpen: boolean
  onClose: () => void
}

interface EnrichedData {
  summary: string
  whatTheyDo: string
  keywords: string[]
  signals: Array<{
    type: string
    confidence: number
    timestamp: string
  }>
  sources: Array<{
    url: string
    title: string
    timestamp: string
  }>
}

export function CompanyProfileSheet({
  company,
  isOpen,
  onClose,
}: CompanyProfileSheetProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isEnriching, setIsEnriching] = useState(false)
  const [enrichedData, setEnrichedData] = useState<EnrichedData | null>(null)

  const handleEnrich = async () => {
    setIsEnriching(true)
    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website: company.website,
          company_name: company.name,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        setEnrichedData(data)
      }
    } catch (error) {
      console.error('Enrichment failed:', error)
    } finally {
      setIsEnriching(false)
    }
  }

  const stageColorMap = {
    'Seed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Series A': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Series B': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'Late Stage': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  }

  const signalColorMap = {
    'High': 'text-green-600 dark:text-green-400',
    'Medium': 'text-yellow-600 dark:text-yellow-400',
    'Low': 'text-red-600 dark:text-red-400',
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SheetTitle className="text-2xl mb-2">{company.name}</SheetTitle>
              <SheetDescription className="text-base">{company.description}</SheetDescription>
              <div className="flex gap-2 mt-4 flex-wrap">
                <a
                  href={`https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  {company.website}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant={isSaved ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsSaved(!isSaved)}
              className="gap-2"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
            <Button
              onClick={handleEnrich}
              disabled={isEnriching}
              size="sm"
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEnriching ? 'Enriching...' : 'Enrich Data'}</span>
            </Button>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 bg-card/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Stage</span>
              </div>
              <Badge className={stageColorMap[company.stage]}>
                {company.stage}
              </Badge>
            </div>

            <div className="border border-border rounded-lg p-4 bg-card/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Signals</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className={`w-5 h-5 ${signalColorMap[company.signals]}`} />
                <span className="font-semibold">{company.signals}</span>
              </div>
            </div>

            <div className="border border-border rounded-lg p-4 bg-card/50">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Industry</span>
              </div>
              <Badge variant="outline">{company.industry}</Badge>
            </div>

            <div className="border border-border rounded-lg p-4 bg-card/50">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Funding</span>
              </div>
              <p className="font-semibold text-lg text-primary">${(company.funding / 1e6).toFixed(0)}M</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="border border-border rounded-lg p-3 bg-card/50">
              <div className="text-2xl font-bold text-primary">{company.employees}</div>
              <div className="text-xs text-muted-foreground mt-1">Employees</div>
            </div>
            <div className="border border-border rounded-lg p-3 bg-card/50">
              <div className="text-2xl font-bold text-primary">{company.yearFounded}</div>
              <div className="text-xs text-muted-foreground mt-1">Founded</div>
            </div>
            <div className="border border-border rounded-lg p-3 bg-card/50">
              <div className="text-2xl font-bold text-primary">{company.founders.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Founders</div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="founders" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-background border border-border">
              <TabsTrigger value="founders">Founders</TabsTrigger>
              <TabsTrigger value="signals">Signals</TabsTrigger>
              <TabsTrigger value="enrichment">Enrichment</TabsTrigger>
            </TabsList>

            <TabsContent value="founders" className="space-y-3">
              <div className="border border-border rounded-lg p-4">
                {company.founders.map((founder, idx) => (
                  <div key={idx} className="flex items-center gap-3 mb-3 pb-3 border-b border-border last:mb-0 last:pb-0 last:border-b-0">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{founder}</p>
                      <p className="text-xs text-muted-foreground">Founder</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="signals" className="space-y-3">
              <div className="border border-border rounded-lg p-4 space-y-3">
                <div className="pb-3 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">Growth Trajectory</h4>
                    <Badge variant="default" className="bg-green-600">Strong</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Company shows positive signals in market positioning and funding growth
                  </p>
                </div>

                <div className="pb-3 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">Market Demand</h4>
                    <Badge variant="default" className="bg-blue-600">High</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Operating in growing market segment with strong investor interest
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">Team Strength</h4>
                    <Badge variant="default" className="bg-purple-600">Excellent</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Experienced founding team with track record in this domain
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="enrichment" className="space-y-3">
              {enrichedData ? (
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4 bg-card/50 space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Company Summary</h4>
                      <p className="text-sm text-muted-foreground">{enrichedData.summary}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">What They Do</h4>
                      <p className="text-sm text-muted-foreground">{enrichedData.whatTheyDo}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3">Key Keywords</h4>
                      <div className="flex gap-2 flex-wrap">
                        {enrichedData.keywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3">Growth Signals</h4>
                      <div className="space-y-2">
                        {enrichedData.signals.map((signal, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                            <span className="text-sm text-foreground">{signal.type}</span>
                            <Badge className="bg-green-600">{Math.round(signal.confidence * 100)}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3">Sources</h4>
                      <div className="space-y-2">
                        {enrichedData.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-2 p-2 rounded hover:bg-primary/10 transition-colors text-sm"
                          >
                            <ExternalLink className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-primary hover:underline truncate">{source.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(source.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-border rounded-lg p-4 bg-card/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h4 className="font-medium text-foreground">AI-Powered Enrichment</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click the &apos;Enrich Data&apos; button above to generate real-time intelligence:
                  </p>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Company summary and business model analysis</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Key product features and market positioning</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Recent news and product launches</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Investment signals and growth indicators</span>
                    </li>
                  </ul>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
