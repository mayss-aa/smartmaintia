import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/store/auth/AuthProvider'
import { ToastProvider } from '@/components/feedback/Toast'
import { queryClient } from '@/lib/react-query'
import { router } from '@/router'

export default function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
