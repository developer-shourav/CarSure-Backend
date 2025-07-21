import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { Blog } from '../blog/blog.model';
import { Car } from '../car/car.model';
import { Order } from '../order/order.model';
import { DashboardStats } from './dashboardStats.model';

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

/* --------Logic for refreshing dashboard data------ */
const refreshDashboardDataFromDB = async () => {
  // ... (The aggregation logic from before)
  const totalUsers = await User.countDocuments();
  const totalCars = await Car.countDocuments();

  const orderData = await Order.aggregate([
    {
      $facet: {
        totalOrders: [{ $count: 'count' }],
        totalPendingOrders: [
          { $match: { status: 'Pending' } },
          { $count: 'count' },
        ],
        totalCancelledOrders: [
          { $match: { status: 'Cancelled' } },
          { $count: 'count' },
        ],
        totalDeliveredOrders: [
          { $match: { status: { $in: ['Shipped', 'Completed'] } } },
          { $count: 'count' },
        ],
        totalPaidOrders: [
          { $match: { status: 'Paid' } },
          { $count: 'count' },
        ],
        totalSales: [
          { $match: { status: { $in: ['Paid', 'Completed', 'Shipped'] } } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ],
        last8Orders: [
          { $sort: { createdAt: -1 } },
          { $limit: 8 },
          { $project: { _id: 1, status: 1, totalPrice: 1 } },
        ],
      },
    },
  ]);

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

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
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
      users: monthData ? monthData.count : 0,
    };
  }).reverse();

  const last8Users = await User.find()
    .sort({ createdAt: -1 })
    .limit(8)
    .select('name email');

  const stats = {
    totalUsers,
    totalCars,
    totalOrders: orderData[0].totalOrders[0]?.count || 0,
    totalPendingOrders: orderData[0].totalPendingOrders[0]?.count || 0,
    totalCancelledOrders: orderData[0].totalCancelledOrders[0]?.count || 0,
    totalDeliveredOrders: orderData[0].totalDeliveredOrders[0]?.count || 0,
    totalPaidOrders: orderData[0].totalPaidOrders[0]?.count || 0,
    totalSales: orderData[0].totalSales[0]?.total || 0,
    monthlyUserGrowth,
    last8Users,
    last8Orders: orderData[0].last8Orders,
  };

  await DashboardStats.findOneAndUpdate({}, { stats, lastUpdatedAt: new Date() }, { upsert: true });

  return stats;
};

/* --------Logic For get dashboard data------ */
const getDashboardDataFromDB = async () => {
  const dashboardData = await DashboardStats.findOne();
  if (!dashboardData) {
    return refreshDashboardDataFromDB();
  }
  return dashboardData.stats;
};

export const AdminActionsServices = {
  blockUserFromDB,
  deleteBlogFromDB,
  getDashboardDataFromDB,
  refreshDashboardDataFromDB,
};
