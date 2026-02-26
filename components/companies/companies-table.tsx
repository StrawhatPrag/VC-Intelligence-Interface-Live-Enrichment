'use client'

import { useState } from 'react'
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
import { Bookmark, BookmarkCheck, Zap, ArrowUpDown } from 'lucide-react'
import { Company } from '@/lib/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useStore } from '@/lib/store'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'

interface CompaniesTableProps {
  companies: Company[]
  selectedCompany: string | null
  onSelectCompany: (id: string) => void
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

export function CompaniesTable({
  companies,
  selectedCompany,
  onSelectCompany,
}: CompaniesTableProps) {
  const savedCompanies = useStore((state) => state.savedCompanies)
  const toggleSavedCompany = useStore((state) => state.toggleSavedCompany)

  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: 'id',
      header: '#',
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.index + 1}</span>,
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4 font-semibold hover:bg-transparent"
          >
            Company
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.website}</span>
        </div>
      ),
    },
    {
      accessorKey: 'industry',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4 font-semibold hover:bg-transparent"
          >
            Industry
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {row.getValue('industry')}
        </Badge>
      ),
    },
    {
      accessorKey: 'stage',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4 font-semibold hover:bg-transparent"
          >
            Stage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const stage = row.getValue('stage') as string
        return (
          <Badge className={stageColors[stage] || 'bg-gray-100 text-gray-800'}>
            {stage}
          </Badge>
        )
      },
      sortingFn: 'alphanumeric',
    },
    {
      accessorKey: 'signals',
      header: ({ column }) => {
        return (
          <div className="text-center font-semibold">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="font-semibold hover:bg-transparent"
            >
              Signals
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const signal = row.getValue('signals') as string
        return (
          <div className="flex items-center justify-center gap-1">
            <Zap className={`w-4 h-4 ${signalColors[signal] || 'text-gray-500'}`} />
            <span className="text-xs font-medium">{signal}</span>
          </div>
        )
      },
      sortingFn: (rowA, rowB, columnId) => {
        const scoreA = rowA.getValue(columnId) === 'High' ? 3 : rowA.getValue(columnId) === 'Medium' ? 2 : 1;
        const scoreB = rowB.getValue(columnId) === 'High' ? 3 : rowB.getValue(columnId) === 'Medium' ? 2 : 1;
        return scoreA - scoreB;
      }
    },
    {
      accessorKey: 'funding',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4 font-semibold hover:bg-transparent"
          >
            Metrics
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const funding = row.getValue('funding') as number
        return (
          <span className="bg-muted px-2 py-1 rounded text-xs text-muted-foreground">
            ${(funding / 1e6).toFixed(0)}M
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: () => <div className="w-20 text-center font-semibold">Actions</div>,
      cell: ({ row }) => {
        const companyId = row.original.id
        return (
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {savedCompanies.has(companyId) ? (
                    <BookmarkCheck className="w-4 h-4 text-primary" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  toggleSavedCompany(companyId)
                }}>
                  {savedCompanies.has(companyId) ? 'Remove from saved' : 'Save company'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  Add to list
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
    },
  ]

  const table = useReactTable({
    data: companies,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader className="bg-card/50 sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-border hover:bg-card/50">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className={header.column.id === 'id' ? 'w-10' : ''}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={`border-border cursor-pointer transition-colors ${
                  selectedCompany === row.original.id
                    ? 'bg-primary/10'
                    : 'hover:bg-card/50'
                }`}
                onClick={() => onSelectCompany(row.original.id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
