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

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({ invalid_type_error: 'Current password must be a string' })
      .min(1, { message: 'Current password is required' }),
    newPassword: z
      .string({ invalid_type_error: 'New password must be a string' })
      .min(6, { message: 'New password must be at least 6 characters' })
      .max(20, { message: 'New password cannot be more than 20 characters' }),
  }),
});

const updateUserInfoSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    profileImg: z.string().optional(),
  }),
});

export const userValidation = {
  userValidationSchema,
  changePasswordSchema,
  updateUserInfoSchema,
};
