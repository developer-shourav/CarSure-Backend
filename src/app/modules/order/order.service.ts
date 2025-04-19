import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Car } from '../car/car.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';
import { orderUtils } from './order.utils';

/* ----------- Logic for Create a new order and manage inventory ----------- */
const createNewOrder = async (orderData: TOrder) => {
  const customerDetails = orderData?.customerInfo;
  //----------- Find the car by its ID
  const car = await Car.findById(orderData.carId);
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found!');
  }

  //----------- Check if sufficient quantity is available
  if (
    car.quantity === 0 ||
    car.inStock === false ||
    car.quantity < orderData.quantity
  ) {
    throw new AppError(httpStatus.CONFLICT, 'Insufficient stock available!');
  }

  //----------- Calculate the total price
  const totalPrice = car.price * orderData.quantity;

  //----------- Check if User Given Price is correct or not
  if (totalPrice !== orderData.totalPrice) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your added price is not equal to car actual price!',
    );
  }

  //----------- Update the car's inventory
  car.quantity -= orderData.quantity;
  if (car.quantity === 0) {
    car.inStock = false;
  }
  await car.save();

  //----------- Create a new order
  let order = await Order.create(orderData);

 // payment integration
 const shurjopayPayload = {
  amount: totalPrice,
  order_id: order._id,
  currency: "BDT",
  customer_name: customerDetails.name,
  customer_address: customerDetails.address,
  customer_email: customerDetails.email,
  customer_phone: customerDetails.phone,
  customer_city: customerDetails.city,
  client_ip: customerDetails.userIP,
};

const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

if (payment?.transactionStatus) {
  order = await order.updateOne({
    transaction: {
      id: payment.sp_order_id,
      transactionStatus: payment.transactionStatus,
    },
  });
}

return payment.checkout_url;
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

/* ---------- Logic for Get An user All orders From Database  ---------- */
const getSingleUserOrdersFromDB = async (userId: string) => {
  const result = await Order.find({ user: userId });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
  }
  return result;
};

/* -------------Logic for update an Order------------------ */
const updateSingleOrderFromDB = async (
  orderId: string,
  orderUpdates: Partial<TOrder>,
) => {
  const updatedCar = await Order.findByIdAndUpdate(
    orderId,
    orderUpdates,
    { new: true, runValidators: true }, // Return the updated document and apply validation
  );
  if (!updatedCar) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
  }
  return updatedCar;
};

/* ---------------Verify Payment ---------------- */
const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        "transaction.id": order_id,
      },
      {
        "transaction.bank_status": verifiedPayment[0].bank_status,
        "transaction.sp_code": verifiedPayment[0].sp_code,
        "transaction.sp_message": verifiedPayment[0].sp_message,
        "transaction.transactionStatus": verifiedPayment[0].transaction_status,
        "transaction.method": verifiedPayment[0].method,
        "transaction.date_time": verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == "Success"
            ? "Paid"
            : verifiedPayment[0].bank_status == "Failed"
            ? "Pending"
            : verifiedPayment[0].bank_status == "Cancel"
            ? "Cancelled"
            : "",
      }
    );
  }

  return verifiedPayment;
};


/* ---------- Logic for Delete an Order from Database  ---------- */
const deleteAnOrderFromDB = async (orderId: string) => {
  const result = await Order.findByIdAndDelete({ _id: orderId });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
  }

  return result;
};

export const OrderServices = {
  createNewOrder,
  calculateTotalRevenue,
  getAllOrdersFromDB,
  getSingleUserOrdersFromDB,
  updateSingleOrderFromDB,
  verifyPayment,
  deleteAnOrderFromDB,
};
