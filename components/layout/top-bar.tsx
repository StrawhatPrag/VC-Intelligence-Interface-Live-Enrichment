'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, Download } from 'lucide-react'

export function TopBar() {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search companies, keywords..."
              className="pl-10 bg-background border-border placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New List</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
