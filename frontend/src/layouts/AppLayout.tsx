import { useState, useEffect, useCallback, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/navigation/Sidebar'
import { Topbar } from '@/components/navigation/Topbar'
import AppShell from './AppShell'

const BREAKPOINT = 900

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => window.innerWidth < BREAKPOINT,
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const userOverride = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${BREAKPOINT - 0.02}px)`)
    const apply = (e: MediaQueryListEvent | MediaQueryList) => {
      if (!userOverride.current) setSidebarCollapsed(e.matches)
      if (!e.matches) userOverride.current = false
    }
    apply(mq)
    mq.addEventListener('change', apply as (e: MediaQueryListEvent) => void)
    return () => mq.removeEventListener('change', apply as (e: MediaQueryListEvent) => void)
  }, [])

  const handleToggleCollapse = useCallback(() => {
    userOverride.current = true
    setSidebarCollapsed((prev) => !prev)
  }, [])

  return (
    <AppShell>
      <div className="grid h-full min-h-0 grid-cols-[auto_1fr] overflow-hidden">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        <div className="grid h-full min-w-0 grid-rows-[auto_1fr] overflow-hidden">
          <Topbar
            onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
          />

          <main className="scroll-area min-h-0 min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain px-pad-x py-pad-y">
            <Outlet />
          </main>
        </div>
      </div>
    </AppShell>
  )
}
