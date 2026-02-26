'use client'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Compass, List, Bookmark, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MainNav() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-sm text-sidebar-foreground">VC Intelligence</h1>
            <p className="text-xs text-sidebar-accent">Precision Sourcing</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <nav className="space-y-2">
          <Button
            variant={pathname === '/companies' ? 'default' : 'ghost'}
            size="sm"
            className="w-full justify-start gap-3 font-medium"
            asChild
          >
            <Link href="/companies">
              <Compass className="w-4 h-4" />
              <span>Explore Companies</span>
            </Link>
          </Button>

          <Button
            variant={pathname === '/lists' ? 'default' : 'ghost'}
            size="sm"
            className="w-full justify-start gap-3 font-medium"
            asChild
          >
            <Link href="/lists">
              <List className="w-4 h-4" />
              <span>My Lists</span>
            </Link>
          </Button>

          <Button
            variant={pathname === '/saved-searches' ? 'default' : 'ghost'}
            size="sm"
            className="w-full justify-start gap-3 font-medium"
            asChild
          >
            <Link href="/saved-searches">
              <Bookmark className="w-4 h-4" />
              <span>Saved Searches</span>
            </Link>
          </Button>
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-2 py-4 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
