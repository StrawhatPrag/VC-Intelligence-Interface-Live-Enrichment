'use client'

import { useState } from 'react'
import { CompaniesTable } from '@/components/companies/companies-table'
import { CompanyFilters } from '@/components/companies/company-filters'
import { CompanyProfileSheet } from '@/components/companies/company-profile-sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MOCK_COMPANIES } from '@/lib/mock-data'

export function CompaniesPage() {
  const [filteredCompanies, setFilteredCompanies] = useState(MOCK_COMPANIES)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)

  const selectedCompany = selectedCompanyId 
    ? MOCK_COMPANIES.find(c => c.id === selectedCompanyId)
    : null

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-card/30">
        <div className="px-6 py-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Explore Companies</h1>
          <p className="text-sm text-muted-foreground">
            Browse and enrich company data with real-time intelligence
          </p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 border-r border-border bg-card/20 overflow-auto p-4">
          <CompanyFilters 
            companies={MOCK_COMPANIES}
            onFiltersChange={setFilteredCompanies}
          />
        </div>

        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="table" className="h-full flex flex-col">
            <div className="border-b border-border bg-card/30 px-6 py-4 sticky top-0">
              <TabsList className="bg-background border border-border">
                <TabsTrigger value="table" className="gap-2">
                  <span>Table View</span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                    {filteredCompanies.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="cards" className="gap-2">
                  <span>Card View</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="table" className="flex-1 overflow-auto">
              <CompaniesTable 
                companies={filteredCompanies}
                selectedCompany={selectedCompanyId}
                onSelectCompany={setSelectedCompanyId}
              />
            </TabsContent>

            <TabsContent value="cards" className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCompanies.map((company) => (
                  <div 
                    key={company.id}
                    className="p-4 border border-border rounded-lg bg-card hover:bg-card/80 cursor-pointer transition-colors"
                    onClick={() => setSelectedCompanyId(company.id)}
                  >
                    <h3 className="font-semibold text-foreground">{company.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{company.description}</p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded">
                        {company.industry}
                      </span>
                      <span className="text-xs bg-primary/20 text-primary-foreground px-2 py-1 rounded">
                        {company.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedCompany && (
        <CompanyProfileSheet 
          company={selectedCompany}
          isOpen={!!selectedCompany}
          onClose={() => setSelectedCompanyId(null)}
        />
      )}
    </div>
  )
}
