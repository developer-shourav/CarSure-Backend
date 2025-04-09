import { z } from 'zod';

const userValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ invalid_type_error: 'Name must be a string' })
      .min(1, { message: 'Name is required' }),
    email: z.string({ invalid_type_error: 'Inter valid email' }).email(),
    password: z
      .string({ invalid_type_error: 'Password must be a string' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(20, { message: 'Password cannot be more than 20 characters' }),
    role: z
      .enum(['admin', 'user'], {
        invalid_type_error: 'Role must be either "admin" or "user"',
      })
      .optional(),
    isBlocked: z
      .boolean({ invalid_type_error: 'isBlocked must be a boolean' })
      .optional(),
  }),
});

export const userValidation = {
  userValidationSchema,
};
