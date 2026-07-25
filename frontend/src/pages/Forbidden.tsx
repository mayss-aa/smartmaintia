import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import AppShell from '@/layouts/AppShell'

export default function Forbidden() {
  return (
    <AppShell fit>
      <div className="flex h-full flex-col items-center justify-center gap-fluid-sm px-pad-x">
        <h1 className="text-fluid-3xl font-bold text-primary-600">403</h1>
        <h2 className="text-fluid-xl font-semibold text-text-primary">
          Accès refusé
        </h2>
        <p className="text-fluid-sm text-text-secondary">
          Vous n'avez pas les permissions nécessaires.
        </p>
        <Link
          to={ROUTES.DASHBOARD}
          className="rounded-fluid bg-primary-600 px-fluid-lg py-fluid-sm text-fluid-sm text-white hover:bg-primary-700"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </AppShell>
  )
}
