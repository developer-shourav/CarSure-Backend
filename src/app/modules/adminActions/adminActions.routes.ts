import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { AdminActionsControllers } from './adminActions.controller';

const router = express.Router();

// -----------Block User By Admin------------
router.patch(
  '/users/:userId/block',
  auth(USER_ROLE.admin),
  AdminActionsControllers.blockUser,
);

// -----------Delete A Blog By Admin------------
router.delete(
  '/blogs/:id',
  auth(USER_ROLE.admin),
  AdminActionsControllers.deleteBlog,
);

export const AdminActionsRoutes = router;
