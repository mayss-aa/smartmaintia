import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/store/auth/useAuth'
import {
  LogIn,
  LayoutDashboard,
  Menu,
  X,
  ShieldCheck,
  BarChart3,
  Coins,
  Cog,
  Box,
  CalendarDays,
  BrainCircuit,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { getHomeRouteByRole } from '@/lib/navigation'

/* -------------------------------------------------------------------------- */
/*                                   DONNÉES                                  */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'fonctionnalites', label: 'Fonctionnalités' },
  { id: 'avantages', label: 'Avantages' },
  { id: 'comment-ca-marche', label: 'Comment ça marche' },
  { id: 'a-propos', label: 'À propos' },
] as const

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: 'Moins de pannes',
    desc: 'grâce à la maintenance prédictive',
  },
  {
    icon: BarChart3,
    title: 'Plus de productivité',
    desc: 'avec une gestion optimisée',
  },
  {
    icon: Coins,
    title: 'Coûts réduits',
    desc: 'par une meilleure planification',
  },
  {
    icon: Cog,
    title: 'Équipements plus fiables',
    desc: 'et une durée de vie prolongée',
  },
] as const

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Gestion des interventions',
    desc: 'Planifiez, suivez et tracez toutes vos interventions en temps réel.',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    hoverBg: 'group-hover:bg-blue-600',
  },
  {
    icon: BrainCircuit,
    title: 'Intelligence Artificielle',
    desc: 'Prédisez les pannes et recevez des recommandations intelligentes.',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    hoverBg: 'group-hover:bg-violet-600',
  },
  {
    icon: TrendingUp,
    title: 'Tableaux de bord',
    desc: 'Visualisez vos indicateurs clés et prenez les bonnes décisions.',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    hoverBg: 'group-hover:bg-emerald-600',
  },
  {
    icon: Wrench,
    title: 'Suivi des équipements',
    desc: "Maîtrisez l'état et l'historique de tous vos équipements industriels.",
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    hoverBg: 'group-hover:bg-amber-600',
  },
] as const

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  const { user } = useAuth()
  const [activeLink, setActiveLink] = useState<string>('accueil')
  const [menuOpen, setMenuOpen] = useState(false)

  const authLink = user ? getHomeRouteByRole(user.role) : ROUTES.LOGIN
  const authLabel = user ? 'Accéder à mon espace' : 'Se connecter'

  const handleNavClick = (id: string) => {
    setActiveLink(id)
    setMenuOpen(false)
  }

  return (
    /* Le CSS global fige html/body/#root en overflow:hidden.
       C'est ce conteneur qui porte le défilement de la landing page,
       sans impacter le reste de l'application. */
    <div className="scroll-area h-full overflow-y-auto scroll-smooth bg-white">
      {/* Animations locales : le CSS global n'est pas modifié. */}
      <style>{`
        @keyframes smCardIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sm-card {
          opacity: 0;
          animation: smCardIn 520ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
        }
        .sm-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-card-hover);
          border-color: var(--color-primary-200);
        }
        .sm-card-icon {
          transition: background-color 260ms ease, color 260ms ease, transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sm-card:hover .sm-card-icon {
          transform: translateY(-2px) scale(1.08) rotate(-4deg);
          color: #fff;
        }
        @media (prefers-reduced-motion: reduce) {
          .sm-card {
            opacity: 1;
            animation: none;
            transition: box-shadow 150ms ease, border-color 150ms ease;
          }
          .sm-card:hover { transform: none; }
          .sm-card-icon,
          .sm-card:hover .sm-card-icon { transition: none; transform: none; }
        }
      `}</style>

      {/* ==================================================================== */}
      {/*                                NAVBAR                                */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/95 shadow-navbar backdrop-blur-sm">
        <nav className="mx-auto flex h-[clamp(56px,6.5vh,68px)] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-10">
          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5 no-underline"
            onClick={() => handleNavClick('accueil')}
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 shadow-[0_4px_12px_rgb(37_99_235_/_0.28)]">
              <Cog className="h-5 w-5 text-white" strokeWidth={2.2} />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary-300" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[clamp(14px,1vw,17px)] font-bold tracking-tight text-text-primary">
                SmartMaint IA
              </span>
              <span className="mt-0.5 hidden text-[clamp(8px,0.55vw,9.5px)] font-medium tracking-wide text-neutral-400 sm:block">
                Intelligent Maintenance Management
              </span>
            </span>
          </Link>

          {/* Liens — desktop */}
          <div className="hidden items-center gap-7 lg:flex xl:gap-8">
            {NAV_LINKS.map(({ id, label }) => {
              const isActive = activeLink === id
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => handleNavClick(id)}
                  className={`relative whitespace-nowrap pb-1.5 text-fluid-sm no-underline transition-colors duration-200 ${
                    isActive
                      ? 'font-semibold text-primary-500'
                      : 'font-medium text-neutral-600 hover:text-text-primary'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-[2.5px] rounded-full bg-primary-500" />
                  )}
                </a>
              )
            })}
          </div>

          {/* Action unique */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to={authLink}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-surface px-4 py-2 text-fluid-sm font-semibold text-neutral-700 no-underline shadow-btn transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 lg:px-5"
            >
              {authLabel}
              {user ? (
                <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
              ) : (
                <LogIn className="h-4 w-4" strokeWidth={2} />
              )}
            </Link>

            {/* Burger — mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-surface text-neutral-700 transition-colors duration-200 hover:bg-neutral-50 lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Menu déroulant — mobile */}
        {menuOpen && (
          <div className="border-t border-neutral-100 bg-surface px-5 py-2 sm:px-6 lg:hidden">
            <div className="flex flex-col">
              {NAV_LINKS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => handleNavClick(id)}
                  className={`rounded-md px-3 py-2.5 text-fluid-base no-underline transition-colors duration-200 ${
                    activeLink === id
                      ? 'bg-primary-50 font-semibold text-primary-500'
                      : 'font-medium text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ==================================================================== */}
      {/*                          HERO (image complète)                       */}
      {/* ==================================================================== */}
      <section id="accueil" className="w-full scroll-mt-16">
        <img
          src="/images/hero-smartmaint.png"
          alt="SmartMaint IA — une maintenance plus intelligente, plus fiable et plus performante"
          className="block w-full select-none"
          loading="eager"
          decoding="async"
          draggable={false}
        />
      </section>

      {/* ==================================================================== */}
      {/*                            BANDEAU BÉNÉFICES                         */}
      {/* ==================================================================== */}
      <section className="bg-gradient-to-b from-white to-[#F6F9FE] px-5 pb-[clamp(14px,1.6vh,24px)] pt-[clamp(14px,1.8vh,26px)] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 rounded-2xl border border-neutral-100 bg-surface p-[clamp(14px,1.5vw,22px)] shadow-card sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-neutral-100">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group flex items-center gap-3 lg:px-[clamp(10px,1.2vw,20px)] lg:first:pl-0 lg:last:pr-0"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500 transition-all duration-200 group-hover:bg-primary-500 group-hover:text-white">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[clamp(12px,0.86vw,14px)] font-bold leading-tight tracking-tight text-text-primary">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-[clamp(10px,0.75vw,12.5px)] leading-tight text-text-secondary">
                    {desc}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/*                          FONCTIONNALITÉS CLÉS                        */}
      {/* ==================================================================== */}
      <section
        id="fonctionnalites"
        className="relative scroll-mt-16 overflow-hidden bg-gradient-to-b from-[#F6F9FE] via-[#FAFCFF] to-white px-5 pb-[clamp(24px,3vh,44px)] pt-[clamp(18px,2.4vh,36px)] sm:px-6 lg:px-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-0 h-[380px] w-[380px] rounded-full bg-primary-100/35 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1240px]">
          {/* En-tête de section */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-[clamp(10px,0.75vw,12.5px)] font-semibold text-primary-500">
              <Box className="h-[13px] w-[13px]" strokeWidth={2.2} />
              Fonctionnalités clés
            </span>

            <h2 className="mt-3 text-[clamp(19px,1.75vw,29px)] font-bold leading-tight tracking-tight text-text-primary">
              Une plateforme complète pour votre maintenance
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-[clamp(11px,0.85vw,14px)] leading-snug text-text-secondary">
              Tout ce dont vous avez besoin pour gérer, anticiper et optimiser vos
              opérations de maintenance.
            </p>
          </div>

          {/* Cartes compactes animées */}
          <div className="mt-[clamp(16px,2.2vh,32px)] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, desc, iconBg, iconColor, hoverBg }, index) => (
              <article
                key={title}
                style={{ animationDelay: `${index * 90}ms` }}
                className="sm-card group h-full rounded-2xl border border-neutral-100 bg-surface p-[clamp(14px,1.2vw,20px)] shadow-card"
              >
                <span
                  className={`sm-card-icon flex h-10 w-10 items-center justify-center rounded-lg ${iconBg} ${iconColor} ${hoverBg}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-3 text-[clamp(12px,0.88vw,15px)] font-bold leading-tight tracking-tight text-text-primary">
                  {title}
                </h3>
                <p className="mt-1.5 text-[clamp(10px,0.78vw,13px)] leading-snug text-text-secondary">
                  {desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
