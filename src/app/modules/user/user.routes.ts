import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { userValidation } from './user.validation';
import { upload } from '../../utils/hostImageToCloudinary';
import { formDataToJsonConvertor } from '../../middlewares/formDataToJsonConvertor';

const router = express.Router();

// -----------Create An User
router.post(
  '/create-user',
  upload.single('profileImg'),
  formDataToJsonConvertor,
  validateRequest(userValidation.userValidationSchema),
  UserControllers.createUser,
);

export const UserRoutes = router;
