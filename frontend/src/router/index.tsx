import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { ROUTES } from '@/constants/routes'
import { ROLES } from '@/constants/roles'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const Login = lazy(() => import('@/pages/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Users = lazy(() => import('@/pages/Users'))
const TestBenches = lazy(() => import('@/pages/TestBenches'))
const Tickets = lazy(() => import('@/pages/Tickets'))
const Interventions = lazy(() => import('@/pages/Interventions'))
const NewIntervention = lazy(() => import('@/pages/NewIntervention'))
const Planning = lazy(() => import('@/pages/Planning'))
const History = lazy(() => import('@/pages/History'))
const Alerts = lazy(() => import('@/pages/Alerts'))
const Profile = lazy(() => import('@/pages/Profile'))
const Incident = lazy(() => import('@/pages/Incident'))
const Forbidden = lazy(() => import('@/pages/Forbidden'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const AppLayout = lazy(() => import('@/layouts/AppLayout'))

function Lazy({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-[100dvh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Lazy>
        <LandingPage />
      </Lazy>
    ),
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <Lazy>
        <Login />
      </Lazy>
    ),
  },
  {
    path: ROUTES.FORBIDDEN,
    element: (
      <Lazy>
        <Forbidden />
      </Lazy>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <Lazy>
        <NotFound />
      </Lazy>
    ),
  },
  {
    element: (
      <ProtectedRoute />
    ),
    children: [
      {
        element: (
          <Lazy>
            <AppLayout />
          </Lazy>
        ),
        children: [
          {
            path: ROUTES.DASHBOARD.slice(1),
            element: (
              <ProtectedRoute
                allowedRoles={[ROLES.ADMINISTRATEUR, ROLES.MANAGER_MAINTENANCE]}
              >
                <Lazy>
                  <Dashboard />
                </Lazy>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.USERS.slice(1),
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ADMINISTRATEUR]}>
                <Lazy>
                  <Users />
                </Lazy>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.TEST_BENCHES.slice(1),
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ADMINISTRATEUR]}>
                <Lazy>
                  <TestBenches />
                </Lazy>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.TICKETS.slice(1),
            element: (
              <ProtectedRoute
                allowedRoles={[
                  ROLES.MANAGER_MAINTENANCE,
                  ROLES.TECHNICIEN,
                  ROLES.OPERATEUR_PRODUCTION,
                ]}
              >
                <Lazy>
                  <Tickets />
                </Lazy>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.INTERVENTIONS.slice(1),
            element: (
              <ProtectedRoute
                allowedRoles={[ROLES.MANAGER_MAINTENANCE, ROLES.TECHNICIEN]}
              >
                <Lazy>
                  <Interventions />
                </Lazy>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.NEW_INTERVENTION.slice(1),
            element: (
              <ProtectedRoute
                allowedRoles={[ROLES.MANAGER_MAINTENANCE]}
              >
                <Lazy>
                  <NewIntervention />
                </Lazy>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.PLANNING.slice(1),
            element: (
              <ProtectedRoute
                allowedRoles={[ROLES.MANAGER_MAINTENANCE, ROLES.TECHNICIEN]}
              >
                <Lazy>
                  <Planning />
                </Lazy>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.HISTORY.slice(1),
            element: (
              <ProtectedRoute
                allowedRoles={[
                  ROLES.ADMINISTRATEUR,
                  ROLES.MANAGER_MAINTENANCE,
                  ROLES.TECHNICIEN,
                ]}
              >
                <Lazy>
                  <History />
                </Lazy>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.ALERTS.slice(1),
            element: (
              <ProtectedRoute
                allowedRoles={[ROLES.ADMINISTRATEUR, ROLES.MANAGER_MAINTENANCE]}
              >
                <Lazy>
                  <Alerts />
                </Lazy>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.PROFILE.slice(1),
            element: (
              <ProtectedRoute>
                <Lazy>
                  <Profile />
                </Lazy>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.INCIDENT.slice(1),
            element: (
              <ProtectedRoute allowedRoles={[ROLES.OPERATEUR_PRODUCTION]}>
                <Lazy>
                  <Incident />
                </Lazy>
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <Lazy>
        <NotFound />
      </Lazy>
    ),
  },
])
