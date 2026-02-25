'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Company } from '@/lib/types'
import { ChevronDown, X } from 'lucide-react'

interface CompanyFiltersProps {
  companies: Company[]
  onFiltersChange: (filtered: Company[]) => void
}

export function CompanyFilters({ companies, onFiltersChange }: CompanyFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStages, setSelectedStages] = useState<Set<string>>(new Set())
  const [selectedIndustries, setSelectedIndustries] = useState<Set<string>>(new Set())
  const [selectedSignals, setSelectedSignals] = useState<Set<string>>(new Set())
  const [fundingRange, setFundingRange] = useState({ min: 0, max: 500 })
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['stage', 'industry'])
  )

  const stages = ['Seed', 'Series A', 'Series B', 'Late Stage']
  const industries = Array.from(new Set(companies.map(c => c.industry))).sort()
  const signals = ['High', 'Medium', 'Low']

  useEffect(() => {
    let filtered = companies

    if (searchTerm) {
      filtered = filtered.filter(
        c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             c.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedStages.size > 0) {
      filtered = filtered.filter(c => selectedStages.has(c.stage))
    }

    if (selectedIndustries.size > 0) {
      filtered = filtered.filter(c => selectedIndustries.has(c.industry))
    }

    if (selectedSignals.size > 0) {
      filtered = filtered.filter(c => selectedSignals.has(c.signals))
    }

    filtered = filtered.filter(
      c => (c.funding / 1e6) >= fundingRange.min && (c.funding / 1e6) <= fundingRange.max
    )

    onFiltersChange(filtered)
  }, [searchTerm, selectedStages, selectedIndustries, selectedSignals, fundingRange, companies])

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const toggleStage = (stage: string) => {
    const newStages = new Set(selectedStages)
    if (newStages.has(stage)) {
      newStages.delete(stage)
    } else {
      newStages.add(stage)
    }
    setSelectedStages(newStages)
  }

  const toggleIndustry = (industry: string) => {
    const newIndustries = new Set(selectedIndustries)
    if (newIndustries.has(industry)) {
      newIndustries.delete(industry)
    } else {
      newIndustries.add(industry)
    }
    setSelectedIndustries(newIndustries)
  }

  const toggleSignal = (signal: string) => {
    const newSignals = new Set(selectedSignals)
    if (newSignals.has(signal)) {
      newSignals.delete(signal)
    } else {
      newSignals.add(signal)
    }
    setSelectedSignals(newSignals)
  }

  const hasActiveFilters = 
    searchTerm || selectedStages.size > 0 || selectedIndustries.size > 0 || 
    selectedSignals.size > 0 || fundingRange.min > 0 || fundingRange.max < 500

  const handleReset = () => {
    setSearchTerm('')
    setSelectedStages(new Set())
    setSelectedIndustries(new Set())
    setSelectedSignals(new Set())
    setFundingRange({ min: 0, max: 500 })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs h-auto p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div>
        <Input
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-sm"
        />
      </div>

      {/* Stages */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between p-0 h-auto hover:bg-transparent"
          onClick={() => toggleSection('stage')}
        >
          <span className="font-medium text-sm">Funding Stage</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.has('stage') ? 'rotate-180' : ''
            }`}
          />
        </Button>
        {expandedSections.has('stage') && (
          <div className="space-y-2">
            {stages.map(stage => (
              <div key={stage} className="flex items-center space-x-2">
                <Checkbox
                  id={`stage-${stage}`}
                  checked={selectedStages.has(stage)}
                  onCheckedChange={() => toggleStage(stage)}
                />
                <Label
                  htmlFor={`stage-${stage}`}
                  className="text-sm cursor-pointer font-normal"
                >
                  {stage}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Industries */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between p-0 h-auto hover:bg-transparent"
          onClick={() => toggleSection('industry')}
        >
          <span className="font-medium text-sm">Industry</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.has('industry') ? 'rotate-180' : ''
            }`}
          />
        </Button>
        {expandedSections.has('industry') && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {industries.map(industry => (
              <div key={industry} className="flex items-center space-x-2">
                <Checkbox
                  id={`industry-${industry}`}
                  checked={selectedIndustries.has(industry)}
                  onCheckedChange={() => toggleIndustry(industry)}
                />
                <Label
                  htmlFor={`industry-${industry}`}
                  className="text-sm cursor-pointer font-normal"
                >
                  {industry}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Signals */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between p-0 h-auto hover:bg-transparent"
          onClick={() => toggleSection('signals')}
        >
          <span className="font-medium text-sm">Signal Strength</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.has('signals') ? 'rotate-180' : ''
            }`}
          />
        </Button>
        {expandedSections.has('signals') && (
          <div className="space-y-2">
            {signals.map(signal => (
              <div key={signal} className="flex items-center space-x-2">
                <Checkbox
                  id={`signal-${signal}`}
                  checked={selectedSignals.has(signal)}
                  onCheckedChange={() => toggleSignal(signal)}
                />
                <Label
                  htmlFor={`signal-${signal}`}
                  className="text-sm cursor-pointer font-normal"
                >
                  {signal}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
