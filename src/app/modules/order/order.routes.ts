import express from 'express';
import { OrderControllers } from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

/* -------Create an Order */
router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(OrderValidation.orderValidationSchema),
  OrderControllers.createAnOrder,
);

/* -------Get total revenue */
router.get('/revenue', auth(USER_ROLE.admin), OrderControllers.getRevenue);

/* -------Get all orders */
router.get('/', auth(USER_ROLE.admin), OrderControllers.getAllOrders);

/* -------Get Single User's orders */
router.get('/:userId', auth(USER_ROLE.user), OrderControllers.getSingleUserOrders);

/* -------Update Single order */
router.patch(
  '/:orderId',
  auth(USER_ROLE.admin),
  validateRequest(OrderValidation.orderUpdateValidationSchema),
  OrderControllers.updateAnOrder,
);
/* -------Verify An order */
router.get(
  '/verify',
  auth(USER_ROLE.user),
  OrderControllers.updateAnOrder,
);

/* -------Delete an order */
router.delete('/:orderId', auth(USER_ROLE.admin), OrderControllers.deleteAnOrder);

export const OrderRoutes = router;
