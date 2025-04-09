import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ invalid_type_error: 'Invalid email format' })
      .min(1, { message: 'Email is required' })
      .email({ message: 'Enter a valid email address' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, { message: 'Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  refreshTokenValidationSchema,
};
