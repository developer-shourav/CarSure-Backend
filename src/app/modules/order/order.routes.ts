import express from 'express';
import { OrderControllers } from './order.controller';

const router = express.Router();

/* -------Create an Order */
router.post('/', OrderControllers.createAnOrder);

/* -------Get total revenue */
router.get('/revenue', OrderControllers.getRevenue);

/* -------Get all orders */
router.get('/', OrderControllers.getAllOrders);

/* -------Get Single order */
router.get('/:orderId', OrderControllers.getAnOrder);

/* -------Delete an order */
router.delete('/:orderId', OrderControllers.deleteAnOrder);

export const OrderRoutes = router;
