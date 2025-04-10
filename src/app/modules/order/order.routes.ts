import express from 'express';
import { OrderControllers } from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';

const router = express.Router();

/* -------Create an Order */
router.post(
  '/',
  validateRequest(OrderValidation.orderValidationSchema),
  OrderControllers.createAnOrder,
);

/* -------Get total revenue */
router.get('/revenue', OrderControllers.getRevenue);

/* -------Get all orders */
router.get('/', OrderControllers.getAllOrders);

/* -------Get Single order */
router.get('/:orderId', OrderControllers.getAnOrder);

/* -------Update Single order */
router.patch(
  '/:orderId',
  validateRequest(OrderValidation.orderUpdateValidationSchema),
  OrderControllers.updateAnOrder,
);

/* -------Delete an order */
router.delete('/:orderId', OrderControllers.deleteAnOrder);

export const OrderRoutes = router;
