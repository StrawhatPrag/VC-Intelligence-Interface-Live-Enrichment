'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck, MoreHorizontal, Zap } from 'lucide-react'
import { useState } from 'react'
import { Company } from '@/lib/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CompaniesTableProps {
  companies: Company[]
  selectedCompany: string | null
  onSelectCompany: (id: string) => void
}

export function CompaniesTable({
  companies,
  selectedCompany,
  onSelectCompany,
}: CompaniesTableProps) {
  const [saved, setSaved] = useState<Set<string>>(new Set())

  const toggleSave = (id: string) => {
    const newSaved = new Set(saved)
    if (newSaved.has(id)) {
      newSaved.delete(id)
    } else {
      newSaved.add(id)
    }
    setSaved(newSaved)
  }

  const stageColors: Record<string, string> = {
    'Seed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Series A': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Series B': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'Late Stage': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  }

  const signalColors: Record<string, string> = {
    'High': 'text-green-600 dark:text-green-400',
    'Medium': 'text-yellow-600 dark:text-yellow-400',
    'Low': 'text-red-600 dark:text-red-400',
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader className="bg-card/50 sticky top-0 z-10">
          <TableRow className="border-border hover:bg-card/50">
            <TableHead className="w-10">#</TableHead>
            <TableHead className="font-semibold">Company</TableHead>
            <TableHead className="font-semibold">Industry</TableHead>
            <TableHead className="font-semibold">Stage</TableHead>
            <TableHead className="font-semibold text-center">Signals</TableHead>
            <TableHead className="font-semibold">Metrics</TableHead>
            <TableHead className="w-20 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company, idx) => (
            <TableRow
              key={company.id}
              className={`border-border cursor-pointer transition-colors ${
                selectedCompany === company.id
                  ? 'bg-primary/10'
                  : 'hover:bg-card/50'
              }`}
              onClick={() => onSelectCompany(company.id)}
            >
              <TableCell className="text-muted-foreground text-sm">{idx + 1}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{company.name}</span>
                  <span className="text-xs text-muted-foreground">{company.website}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {company.industry}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={stageColors[company.stage] || 'bg-gray-100 text-gray-800'}>
                  {company.stage}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Zap className={`w-4 h-4 ${signalColors[company.signals] || 'text-gray-500'}`} />
                  <span className="text-xs font-medium">{company.signals}</span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                <span className="bg-muted px-2 py-1 rounded">
                  ${(company.funding / 1e6).toFixed(0)}M
                </span>
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {saved.has(company.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-primary" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toggleSave(company.id)}>
                      {saved.has(company.id) ? 'Remove from saved' : 'Save company'}
                    </DropdownMenuItem>
                    <DropdownMenuItem>Add to list</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
