import { Car } from '../car/car.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';

/* ----------- Logic for Create a new order and manage inventory ----------- */
const createNewOrder = async (orderData: TOrder) => {
  //----------- Find the car by its ID
  const car = await Car.findById(orderData.car);
  if (!car) {
    throw new Error('Car not found!');
  }

  //----------- Check if sufficient quantity is available
  if (
    car.quantity === 0 ||
    car.inStock === false ||
    car.quantity < orderData.quantity
  ) {
    throw new Error('Insufficient stock available!');
  }

  //----------- Calculate the total price
  const totalPrice = car.price * orderData.quantity;

  //----------- Check if User Given Price is correct or not
  if (totalPrice !== orderData.totalPrice) {
    throw new Error('Your added price is not equal to car actual price!');
  }

  //----------- Update the car's inventory
  car.quantity -= orderData.quantity;
  if (car.quantity === 0) {
    car.inStock = false;
  }
  await car.save();

  //----------- Create a new order
  const newOrder = await Order.create(orderData);
  return newOrder;
};

/* ---------- Logic for Calculate Revenue from Orders  ---------- */
const calculateTotalRevenue = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' }, // Sum up all `totalPrice` values
      },
    },
  ]);

  return result[0]?.totalRevenue || 0; // Default to 0 if no orders
};

/* ---------- Logic for Get All orders From Database  ---------- */
const getAllOrdersFromDB = async () => {
  const result = await Order.find();
  return result;
};

/* ---------- Logic for Get An order From Database  ---------- */
const getAnOrderFromDB = async (orderId: string) => {
  const result = await Order.findOne({ _id: orderId });
  if (!result) {
    throw new Error('Order not found!');
  }
  return result;
};

/* ---------- Logic for Delete an Order from Database  ---------- */
const deleteAnOrderFromDB = async (orderId: string) => {
  const result = await Order.findByIdAndDelete({ _id: orderId });
  if (!result) {
    throw new Error('Order not found!');
  }

  return result;
};

export const OrderServices = {
  createNewOrder,
  calculateTotalRevenue,
  getAllOrdersFromDB,
  getAnOrderFromDB,
  deleteAnOrderFromDB,
};
