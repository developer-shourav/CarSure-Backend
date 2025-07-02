import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { userValidation } from './user.validation';
import { upload } from '../../utils/hostImageToCloudinary';
import { formDataToJsonConvertor } from '../../middlewares/formDataToJsonConvertor';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

// -----------Create An User
router.post(
  '/create-user',
  upload.single('profileImg'),
  formDataToJsonConvertor,
  validateRequest(userValidation.userValidationSchema),
  UserControllers.createUser,
);
// -----------Get All Users
router.get('/all', auth(USER_ROLE.admin), UserControllers.getAllUsers);

// -----------Get Single User
router.get('/:userId', auth(USER_ROLE.admin, USER_ROLE.user), UserControllers.getSingleUser);
// -----------Change Password
router.patch(
  '/change-password',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(userValidation.changePasswordSchema),
  UserControllers.changePassword,
);

// -----------Update User Information
router.patch(
  '/update-info',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(userValidation.updateUserInfoSchema),
  UserControllers.updateUserInfo,
);

export const UserRoutes = router;
