import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { userValidation } from './user.validation';

const router = express.Router();

// -----------Create An User
router.post(
  '/create-user',
  validateRequest(userValidation.userValidationSchema),
  UserControllers.createUser,
);

export const UserRoutes = router;
