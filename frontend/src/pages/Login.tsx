import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import {
  Settings,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  LineChart,
  Wrench,
  ShieldPlus,
} from 'lucide-react'
import { useLogin } from '@/features/auth/hooks/useLogin'
import FullScreenLayout from '@/layouts/FullScreenLayout'

const REMEMBER_EMAIL_KEY = 'smartmaint_remember_email'

type MutationState = { isPending?: boolean; isLoading?: boolean }
const isBusy = (mutation: unknown): boolean => {
  const state = mutation as MutationState
  return state.isPending ?? state.isLoading ?? false
}

const FEATURES = [
  { icon: LineChart, line1: 'Surveillance', line2: 'en temps r\u00e9el' },
  { icon: Wrench, line1: 'Maintenance', line2: 'pr\u00e9dictive' },
  { icon: ShieldPlus, line1: 'Fiabilit\u00e9', line2: 'accrue' },
] as const

export default function Login() {
  const [email, setEmail] = useState(
    () => localStorage.getItem(REMEMBER_EMAIL_KEY) ?? '',
  )
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(
    () => !!localStorage.getItem(REMEMBER_EMAIL_KEY),
  )
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_EMAIL_KEY)
    if (saved) {
      setEmail(saved)
      setRemember(true)
    }
  }, [])

  const loginMutation = useLogin()
  const { mutate: login, isError } = loginMutation
  const submitting = isBusy(loginMutation)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (remember) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, email)
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY)
    }
    login({ email, password, remember })
  }

  const inputBase =
    'w-full rounded-xl border border-slate-200 bg-white text-slate-900 ' +
    'placeholder:text-slate-400 transition-colors duration-200 ' +
    'hover:border-slate-300 ' +
    'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'

  return (
    <FullScreenLayout>
      <div className="absolute inset-0 -z-20 h-full w-full">
        <img
          src="/images/login-bg.webp"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-900/70 to-blue-600/30"
        />
      </div>
      <div className="h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain">
        <div className="grid min-h-full grid-cols-1 md:grid-cols-[1fr_minmax(0,38%)]">
          <div className="grid grid-rows-[auto_1fr_auto] px-[clamp(24px,3.5vw,64px)] py-[clamp(18px,3vh,40px)] text-white">
            <header className="flex shrink-0 items-center gap-3">
              <Settings
                className="text-[#2563EB]"
                style={{ width: 'clamp(22px,1.7vw,30px)', height: 'clamp(22px,1.7vw,30px)' }}
                strokeWidth={2.5}
              />
              <span className="text-fluid-xl font-bold tracking-tight text-white">
                SmartMaint IA
              </span>
            </header>

            <div className="flex min-h-0 flex-col justify-center" style={{ gap: 'clamp(12px,2vh,24px)' }}>
              <h1
                className="max-w-[22ch] text-fluid-3xl font-bold leading-[1.2]"
              >
                Maintenance <span className="text-blue-500">intelligente</span>,<br />
                performance <span className="text-blue-500">durable.</span>
              </h1>
              <p className="hero-paragraph max-w-[46ch] text-fluid-base leading-relaxed text-white/85">
                SmartMaint IA vous aide à anticiper les pannes, optimiser vos opérations et prolonger la
                durée de vie de vos équipements.
              </p>

              <div
                className="flex"
                style={{ gap: 'clamp(20px,2.5vw,48px)' }}
              >
                {FEATURES.map(({ icon: Icon, line1, line2 }) => (
                  <div key={line1} className="text-white">
                    <div
                      className="flex items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm"
                      style={{ width: 'clamp(38px,2.9vw,50px)', height: 'clamp(38px,2.9vw,50px)' }}
                    >
                      <Icon
                        className="text-blue-400"
                        style={{ width: 'var(--icon)', height: 'var(--icon)' }}
                        strokeWidth={2}
                      />
                    </div>
                    <p className="mt-2 text-fluid-sm font-medium leading-tight">
                      {line1}
                      <br />
                      {line2}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <footer className="text-fluid-xs text-white/65">
              &copy; 2025 SmartMaint IA. Tous droits réservés.
            </footer>
          </div>

          <div className="flex items-center justify-center px-[clamp(20px,3vw,56px)] py-[clamp(20px,3vh,40px)]">
            <div
              className="flex w-full max-w-[clamp(360px,29vw,460px)] flex-col rounded-2xl bg-white/96 shadow-2xl"
              style={{ gap: 'clamp(10px,1.5vh,18px)', paddingLeft: 'clamp(22px,2vw,36px)', paddingRight: 'clamp(22px,2vw,36px)', paddingTop: 'clamp(20px,2.6vh,34px)', paddingBottom: 'clamp(20px,2.6vh,34px)' }}
            >
              <div className="flex flex-col items-center text-center" style={{ gap: 'clamp(6px,0.9vh,12px)', marginBottom: 'clamp(12px,2vh,22px)' }}>
                <div
                  className="mx-auto flex items-center justify-center rounded-[14px] bg-blue-600"
                  style={{ width: 'clamp(40px,3vw,54px)', height: 'clamp(40px,3vw,54px)' }}
                >
                  <Settings
                    className="text-white"
                    style={{ width: 'clamp(18px,1.4vw,24px)', height: 'clamp(18px,1.4vw,24px)' }}
                    strokeWidth={2.5}
                  />
                </div>
                <h2 className="text-fluid-2xl font-bold text-slate-900">
                  Bienvenue
                </h2>
                <p className="text-fluid-sm text-slate-500">
                  Connectez-vous pour accéder à votre espace SmartMaint IA.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col"
                style={{ gap: 'clamp(10px,1.5vh,18px)' }}
                noValidate
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-fluid-sm font-semibold text-slate-800"
                  >
                    Adresse e-mail
                  </label>
                  <div className="group relative">
                    <Mail
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-blue-500"
                      style={{ width: 'var(--icon)', height: 'var(--icon)' }}
                      aria-hidden="true"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Entrez votre adresse e-mail"
                      aria-invalid={isError || undefined}
                      className={`${inputBase} pl-12 pr-4`}
                      style={{ height: 'var(--ctrl-h)' }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-fluid-sm font-semibold text-slate-800"
                  >
                    Mot de passe
                  </label>
                  <div className="group relative">
                    <Lock
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-blue-500"
                      style={{ width: 'var(--icon)', height: 'var(--icon)' }}
                      aria-hidden="true"
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe"
                      aria-invalid={isError || undefined}
                      className={`${inputBase} pl-12 pr-[52px]`}
                      style={{ height: 'var(--ctrl-h)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      aria-pressed={showPassword}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400
                                 transition-colors duration-200 hover:text-slate-700
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                    >
                      {showPassword ? (
                        <EyeOff style={{ width: 'var(--icon)', height: 'var(--icon)' }} />
                      ) : (
                        <Eye style={{ width: 'var(--icon)', height: 'var(--icon)' }} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-0.5">
                  <label className="flex cursor-pointer items-center gap-2.5 whitespace-nowrap text-fluid-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 shrink-0 accent-blue-600"
                    />
                    Se souvenir de moi
                  </label>
                  <span className="whitespace-nowrap text-fluid-sm text-blue-600 hover:underline">
                    Mot de passe oublié ?
                  </span>
                </div>

                {isError && (
                  <div
                    role="alert"
                    className="flex animate-[fade-in-up_0.25s_ease-out] items-center gap-3 rounded-xl
                               border border-red-100 bg-red-50 px-4 py-2.5
                               motion-reduce:animate-none"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
                    <p className="text-fluid-sm text-red-600">
                      Adresse e-mail ou mot de passe incorrect.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl
                             bg-blue-600 font-semibold text-white
                             transition-all duration-200 ease-out
                             hover:bg-blue-700
                             active:bg-blue-800
                             focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30
                             disabled:cursor-not-allowed disabled:opacity-65"
                  style={{ height: 'var(--ctrl-h)' }}
                >
                  {submitting ? 'Connexion en cours\u2026' : 'Se connecter'}
                  <ArrowRight
                    style={{ width: 'var(--icon)', height: 'var(--icon)' }}
                    aria-hidden="true"
                  />
                </button>
              </form>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-fluid-sm text-slate-400">
                  ou
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="flex items-center justify-center gap-2 text-fluid-sm text-slate-500">
                <ShieldCheck
                  style={{ width: 'var(--icon)', height: 'var(--icon)' }}
                  aria-hidden="true"
                />
                Connexion sécurisée et chiffrée
              </p>
            </div>
          </div>
        </div>
      </div>
    </FullScreenLayout>
  )
}
