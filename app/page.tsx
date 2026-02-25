'use client'

import { SidebarProvider } from '@/components/ui/sidebar'
import { MainNav } from '@/components/layout/main-nav'
import { TopBar } from '@/components/layout/top-bar'
import { CompaniesPage } from '@/components/pages/companies-page'
import { ListsPage } from '@/components/pages/lists-page'
import { SavedSearchesPage } from '@/components/pages/saved-searches-page'
import { useState } from 'react'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'companies' | 'lists' | 'saved'>('companies')

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <MainNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-auto bg-background">
            {currentPage === 'companies' && <CompaniesPage />}
            {currentPage === 'lists' && <ListsPage />}
            {currentPage === 'saved' && <SavedSearchesPage />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
