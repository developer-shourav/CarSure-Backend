import { OrderServices } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

/* ------------------- Create a New Order ------------------- */
const createAnOrder = catchAsync(async (req, res) => {
  const orderData = req.body;

  // ---------Create a new order
  const result = await OrderServices.createNewOrder(orderData);

  // Send a success response
  sendResponse(res, httpStatus.OK, {
    message: 'Order created successfully',
    data: result,
  });
});

/* ------------------- Calculate Revenue ------------------- */
const getRevenue = catchAsync(async (req, res) => {
  // ------Calculate revenue
  const totalRevenue = await OrderServices.calculateTotalRevenue();

  // ------ Send a success response
  sendResponse(res, httpStatus.OK, {
    message: 'Revenue calculated successfully',
    data: { totalRevenue },
  });
});

/* ------------------- Get All Orders ------------------- */
const getAllOrders = catchAsync(async (req, res) => {
  const result = await OrderServices.getAllOrdersFromDB();

  /* ----Send success response to frontend ------ */
  sendResponse(res, httpStatus.OK, {
    message: 'Orders retrieved successfully',
    data: result,
  });
});

/* ------------------- Get Single Order ------------------- */
const getAnOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await OrderServices.getAnOrderFromDB(orderId);

  /* ----Send success response to frontend ------ */
  sendResponse(res, httpStatus.OK, {
    message: 'Order retrieved successfully',
    data: result,
  });
});

/* -----------------Update An Order------------------------- */
const updateAnOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const OrderUpdates = req.body;

  //----- Update the car in the database-----
  const result = await OrderServices.updateSingleOrderFromDB(
    orderId,
    OrderUpdates,
  );

  /* ----Send success response to frontend ------ */
  sendResponse(res, httpStatus.OK, {
    message: 'Order updated successfully',
    data: result,
  });
});

/* ------------------- Delete an order ------------------- */
const deleteAnOrder = catchAsync(async (req, res) => {
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
  updateAnOrder,
  deleteAnOrder,
};
