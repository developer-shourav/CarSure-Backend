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

// -----------Get Dashboard Data By Admin------------
router.get(
  '/dashboard',
  auth(USER_ROLE.admin),
  AdminActionsControllers.getDashboardData,
);

// -----------Refresh Dashboard Data By Admin------------
router.post(
  '/dashboard/refresh',
  auth(USER_ROLE.admin),
  AdminActionsControllers.refreshDashboardData,
);

export const AdminActionsRoutes = router;
