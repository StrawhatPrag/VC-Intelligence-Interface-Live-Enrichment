'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Trash2, Play, Edit, Clock } from 'lucide-react'
import { SavedSearch } from '@/lib/types'

const MOCK_SEARCHES: SavedSearch[] = [
  {
    id: '1',
    name: 'Fast-Growing Series B',
    filters: {
      stage: ['Series B', 'Series A'],
      industry: ['AI & Machine Learning', 'Fintech'],
      signals: ['High'],
      fundingMin: 25,
      fundingMax: 500,
    },
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Bootstrapped Healthcare',
    filters: {
      industry: ['Healthcare'],
      stage: ['Seed'],
      fundingMax: 10,
    },
    createdAt: '2024-01-28T14:30:00Z',
  },
  {
    id: '3',
    name: 'Late Stage Enterprise',
    filters: {
      stage: ['Late Stage'],
      fundingMin: 500,
    },
    createdAt: '2024-01-20T09:15:00Z',
  },
]

export function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>(MOCK_SEARCHES)

  const handleDelete = (id: string) => {
    setSearches(searches.filter(s => s.id !== id))
  }

  const formatFilters = (filters: SavedSearch['filters']) => {
    const parts = []
    if (filters.stage?.length) parts.push(filters.stage.join(' / '))
    if (filters.industry?.length) parts.push(filters.industry.join(' / '))
    if (filters.signals?.length) parts.push(`Signal: ${filters.signals.join(' / ')}`)
    if (filters.fundingMin || filters.fundingMax) {
      parts.push(`$${filters.fundingMin || 0}M - $${filters.fundingMax || '∞'}M`)
    }
    return parts.join(' • ')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-card/30">
        <div className="px-6 py-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Saved Searches</h1>
          <p className="text-sm text-muted-foreground">
            Run your favorite searches anytime to discover new companies
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-3">
          {searches.map((search) => (
            <Card
              key={search.id}
              className="border-border bg-card/50 hover:bg-card/80 transition-colors p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-lg">{search.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {formatFilters(search.filters)}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Created {new Date(search.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="default"
                    className="gap-2"
                  >
                    <Play className="w-4 h-4" />
                    <span className="hidden sm:inline">Run</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(search.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
