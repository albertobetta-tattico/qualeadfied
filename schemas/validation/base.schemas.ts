import { z } from 'zod'

export const baseValidation = {
  email: z.string().email('Email non valida'),
  required: z.string().min(1, 'Campo obbligatorio'),
  optionalString: z.string().optional(),
}