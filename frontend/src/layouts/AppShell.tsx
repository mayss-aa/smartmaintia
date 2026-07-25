import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
  background?: ReactNode
  fit?: boolean
}

export default function AppShell({ children, background, fit = false }: AppShellProps) {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      {background}
      <div className={`h-full w-full ${fit ? 'fit-screen overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>
        {children}
      </div>
    </div>
  )
}
