import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminActionsServices } from './adminActions.service';

/* ----------------------Block An User----------------- */
const blockUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  // will call service function to send this data
  await AdminActionsServices.blockUserFromDB(userId);

  sendResponse(res, httpStatus.OK, {
    message: 'User blocked successfully',
  });
});

/* ----------------------Delete A Blog----------------- */
const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params;

  // will call service function to send this data
  await AdminActionsServices.deleteBlogFromDB(id);

  sendResponse(res, httpStatus.OK, {
    message: 'Blog deleted successfully',
  });
});

/* ----------------------GET DASHBOARD DATA----------------- */
const getDashboardData = catchAsync(async (req, res) => {
  // will call service function to send this data
  const data = await AdminActionsServices.getDashboardDataFromDB();

  sendResponse(res, httpStatus.OK, {
    message: 'Dashboard data retrieved successfully',
    data,
  });
});

/* ----------------------REFRESH DASHBOARD DATA----------------- */
const refreshDashboardData = catchAsync(async (req, res) => {
  // will call service function to send this data
  const data = await AdminActionsServices.refreshDashboardDataFromDB();

  sendResponse(res, httpStatus.OK, {
    message: 'Dashboard data refreshed successfully',
    data,
  });
});

export const AdminActionsControllers = {
  blockUser,
  deleteBlog,
  getDashboardData,
  refreshDashboardData,
};
