import { Request, Response } from 'express';
import { orderValidationSchema } from './order.validation';
import { OrderServices } from './order.service';
import { Types } from 'mongoose';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

/* ------------------- Create a New Order ------------------- */
const createAnOrder = catchAsync(async (req: Request, res: Response) => {
  // ---------Validate the request body
  const orderData = orderValidationSchema.parse(req.body);

  // ---------Convert car to ObjectId
  const parsedOrderData = {
    ...orderData,
    car: new Types.ObjectId(orderData.car),
  };

  // ---------Create a new order
  const result = await OrderServices.createNewOrder(parsedOrderData);

  // Send a success response
  sendResponse(res, httpStatus.OK, {
    message: 'Order created successfully',
    data: result,
  });
});

/* ------------------- Calculate Revenue ------------------- */
const getRevenue = catchAsync(async (req: Request, res: Response) => {
  // ------Calculate revenue
  const totalRevenue = await OrderServices.calculateTotalRevenue();

  // ------ Send a success response
  sendResponse(res, httpStatus.OK, {
    message: 'Revenue calculated successfully',
    data: { totalRevenue },
  });
});

/* ------------------- Get All Orders ------------------- */
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getAllOrdersFromDB();

  /* ----Send success response to frontend ------ */
  sendResponse(res, httpStatus.OK, {
    message: 'Orders retrieved successfully',
    data: result,
  });
});

/* ------------------- Get Single Order ------------------- */
const getAnOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await OrderServices.getAnOrderFromDB(orderId);

  /* ----Send success response to frontend ------ */
  sendResponse(res, httpStatus.OK, {
    message: 'Order retrieved successfully',
    data: result,
  });
});

/* ------------------- Delete an order ------------------- */
const deleteAnOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  await OrderServices.deleteAnOrderFromDB(orderId);

  /* ----Send success response to frontend ------ */
  sendResponse(res, httpStatus.OK, {
    message: 'Order deleted successfully',
    data: {},
  });
});

export const OrderControllers = {
  createAnOrder,
  getRevenue,
  getAllOrders,
  getAnOrder,
  deleteAnOrder,
};