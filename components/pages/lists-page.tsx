'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2, Share2, Download, Edit } from 'lucide-react'
import { SavedList } from '@/lib/types'

const MOCK_LISTS: SavedList[] = [
  {
    id: '1',
    name: 'Series A AI Companies',
    description: 'Promising AI startups at Series A stage for potential investments',
    companies: ['1', '6', '10', '15'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-15T14:30:00Z',
  },
  {
    id: '2',
    name: 'FinTech Opportunities',
    description: 'Fintech companies showing strong growth signals',
    companies: ['4', '13', '18'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-02-14T11:20:00Z',
  },
]

export function ListsPage() {
  const [lists, setLists] = useState<SavedList[]>(MOCK_LISTS)
  const [newListName, setNewListName] = useState('')
  const [newListDescription, setNewListDescription] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateList = () => {
    if (!newListName.trim()) return

    const newList: SavedList = {
      id: String(lists.length + 1),
      name: newListName,
      description: newListDescription,
      companies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setLists([...lists, newList])
    setNewListName('')
    setNewListDescription('')
    setIsDialogOpen(false)
  }

  const handleDeleteList = (id: string) => {
    setLists(lists.filter(l => l.id !== id))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-card/30">
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Lists</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage company lists for organized sourcing
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                <span>New List</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New List</DialogTitle>
                <DialogDescription>
                  Create a new list to organize your company research
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">List Name</label>
                  <Input
                    placeholder="e.g., Series A AI Companies"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Input
                    placeholder="Add a description for this list"
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateList}>Create List</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <Card
              key={list.id}
              className="border-border bg-card/50 hover:bg-card/80 transition-colors overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{list.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{list.description}</p>
                  </div>
                  <Badge variant="secondary">{list.companies.length}</Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Created: {new Date(list.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(list.updatedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-2 flex-1">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteList(list.id)}
                  >
                    <Trash2 className="w-4 h-4" />
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
