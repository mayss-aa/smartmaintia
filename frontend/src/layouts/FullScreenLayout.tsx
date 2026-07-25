import type { ReactNode } from 'react'

interface FullScreenLayoutProps {
  children: ReactNode
}

export default function FullScreenLayout({ children }: FullScreenLayoutProps) {
  return (
    <div className="h-[100dvh] w-full overflow-hidden">
      <div className="h-full w-full overflow-y-auto overflow-x-hidden">{children}</div>
    </div>
  )
}
