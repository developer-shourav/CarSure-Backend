import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from '../user/user.validation';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

// -----------Register An User
router.post(
  '/register',
  validateRequest(userValidation.userValidationSchema),
  AuthControllers.registerUser,
);

// -----------Login An User
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

/* -------Post Request For Refresh Token */
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

export const AuthRoutes = router;
