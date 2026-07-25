import { useAuth } from '@/store/auth/useAuth'
import { ROLES } from '@/constants/roles'
import AdminDashboard from './AdminDashboard'
import ManagerDashboard from './ManagerDashboard'

export default function Dashboard() {
  const { user } = useAuth()

  if (user?.role === ROLES.ADMINISTRATEUR) {
    return <AdminDashboard />
  }

  return <ManagerDashboard />
}
