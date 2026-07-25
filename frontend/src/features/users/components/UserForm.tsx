import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  userSchema,
  userUpdateSchema,
  type UserFormData,
  type UserUpdateFormData,
} from '@/features/users/utils/validations'
import { ROLES } from '@/constants/roles'
import type { User } from '@/types/user'
import { useEffect } from 'react'

interface UserFormProps {
  user?: User
  onSubmit: (data: Record<string, string | undefined>) => void
  onCancel: () => void
  isLoading?: boolean
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  const schema = user ? userUpdateSchema : userSchema
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData | UserUpdateFormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (user) {
      reset({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      } as UserFormData)
    }
  }, [user, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Nom
          </label>
          <input
            {...register('nom')}
            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
              errors.nom ? 'border-error' : 'border-border'
            }`}
          />
          {errors.nom && <p className="mt-1 text-xs text-error">{errors.nom.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Prénom
          </label>
          <input
            {...register('prenom')}
            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
              errors.prenom ? 'border-error' : 'border-border'
            }`}
          />
          {errors.prenom && <p className="mt-1 text-xs text-error">{errors.prenom.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">
          Email
        </label>
        <input
          type="email"
          {...register('email')}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
            errors.email ? 'border-error' : 'border-border'
          }`}
        />
        {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
      </div>

      {!user && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Mot de passe
          </label>
          <input
            type="password"
            {...register('password')}
            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
              errors.password ? 'border-error' : 'border-border'
            }`}
          />
          {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">
          Rôle
        </label>
        <select
          {...register('role')}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
            errors.role ? 'border-error' : 'border-border'
          }`}
        >
          <option value="">Sélectionner un rôle</option>
          <option value={ROLES.ADMINISTRATEUR}>Administrateur</option>
          <option value={ROLES.MANAGER_MAINTENANCE}>Manager Maintenance</option>
          <option value={ROLES.TECHNICIEN}>Technicien</option>
          <option value={ROLES.OPERATEUR_PRODUCTION}>Opérateur Production</option>
        </select>
        {errors.role && <p className="mt-1 text-xs text-error">{errors.role.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-neutral-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {user ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  )
}
