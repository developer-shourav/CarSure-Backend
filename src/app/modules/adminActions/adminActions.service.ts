import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { Blog } from '../blog/blog.model';
import { Car } from '../car/car.model';
import { Order } from '../order/order.model';

/* --------Logic For Block An User------ */
const blockUserFromDB = async (id: string) => {
  /* ----------find The User Exist Or Not--------------- */
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  const result = await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!result) {
    throw new AppError(400, 'User block failed');
  }

  return result;
};
/* --------Logic For Delete a Blog------ */
const deleteBlogFromDB = async (id: string) => {
  /* ----------find The Blog Exist Or Not--------------- */
  const isBlogExist = await Blog.findById(id);
  if (!isBlogExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog is not found');
  }

  const result = await Blog.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(400, 'Blog delete failed');
  }

  return result;
};

/* --------Logic For get dashboard data------ */
const getDashboardDataFromDB = async () => {
  // Existing counts
  const totalUsers = await User.countDocuments();
  const totalCars = await Car.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalBlogs = await Blog.countDocuments();

  // Order status counts
  const totalPendingOrders = await Order.countDocuments({ status: 'Pending' });
  const totalCancelledOrders = await Order.countDocuments({
    status: 'Cancelled',
  });
  const totalDeliveredOrders = await Order.countDocuments({
    status: { $in: ['Shipped', 'Completed'] },
  });
  const totalPaidOrders = await Order.countDocuments({ status: 'Paid' });

  // Total sales
  const totalSalesData = await Order.aggregate([
    {
      $match: { status: { $in: ['Paid', 'Completed', 'Shipped'] } },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalPrice' },
      },
    },
  ]);
  const totalSales = totalSalesData.length > 0 ? totalSalesData[0].total : 0;

  // Monthly user growth for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyUserGrowthData = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ]);

  // Format the user growth data
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthlyUserGrowth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = monthNames[d.getMonth()];
    const year = d.getFullYear();
    const monthData = monthlyUserGrowthData.find(
      (data) => data._id.year === year && data._id.month === d.getMonth() + 1,
    );
    return {
      month: monthName,
      newRegister: monthData ? monthData.count : 0,
    };
  }).reverse();

  // Last 8 registered users
  const last8Users = await User.find()
    .sort({ createdAt: -1 })
    .limit(8)
    .select('name email');

  // Last 8 orders
  const last8Orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(8)
    .select('_id status totalPrice');

  return {
    totalUsers,
    totalCars,
    totalOrders,
    totalBlogs,
    totalPendingOrders,
    totalCancelledOrders,
    totalDeliveredOrders,
    totalPaidOrders,
    totalSales,
    monthlyUserGrowth,
    last8Users,
    last8Orders,
  };
};

export const AdminActionsServices = {
  blockUserFromDB,
  deleteBlogFromDB,
  getDashboardDataFromDB,
};