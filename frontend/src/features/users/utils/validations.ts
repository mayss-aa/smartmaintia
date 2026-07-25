import { z } from 'zod'

export const userSchema = z.object({
  nom: z.string().min(1, 'Le nom est obligatoire'),
  prenom: z.string().min(1, 'Le prénom est obligatoire'),
  email: z.string().min(1, 'L\'email est obligatoire').email('Format d\'email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
  role: z.string().min(1, 'Le rôle est obligatoire'),
})

export const userUpdateSchema = z.object({
  nom: z.string().min(1, 'Le nom est obligatoire'),
  prenom: z.string().min(1, 'Le prénom est obligatoire'),
  email: z.string().min(1, 'L\'email est obligatoire').email('Format d\'email invalide'),
  password: z.string().optional(),
  role: z.string().min(1, 'Le rôle est obligatoire'),
})

export type UserFormData = z.infer<typeof userSchema>
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>
