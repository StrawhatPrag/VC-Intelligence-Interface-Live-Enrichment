import { SidebarProvider } from '@/components/ui/sidebar'
import { MainNav } from '@/components/layout/main-nav'
import { TopBar } from '@/components/layout/top-bar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <MainNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
