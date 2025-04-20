import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
/* ----------------------Create An User----------------- */
const createUser = catchAsync(async (req, res) => {
  const imageFileDetails = req.file;
  const userData = req.body;

  // will call service function to send this data
  const result = await UserServices.createUserIntoDB(
    imageFileDetails,
    userData,
  );

  sendResponse(res, 201, {
    message: 'User is created successfully',
    data: result,
  });
});

/* ----------------Get All Users------------------- */
const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromBD();
  sendResponse(res, 200, {
    message: 'Users retrieved successfully',
    data: result,
  });
});


/* ----------------Get Single User------------------- */
const getSingleUser = catchAsync(async (req, res) => {

  const loggedInUser = req.user.userId;
  const { userId } = req.params;

  if(loggedInUser !== userId) {
    return sendResponse(res, httpStatus.UNAUTHORIZED, {
      message: 'You are not authorized to access this resource',
      data: null,
    });
  }
  const result = await UserServices.getSingleUserFromBD(userId);
  sendResponse(res, 200, {
    message: 'User retrieved successfully',
    data: result,
  });
});

/* ----------------------Change Password----------------- */
const changePassword = catchAsync(async (req, res) => {
  const userId = req.user.userId; // Authenticated user's ID
  const { currentPassword, newPassword } = req.body;

  await UserServices.changePassword(userId, currentPassword, newPassword);

  sendResponse(res, 200, {
    message: 'Password changed successfully',
    data: null,
  });
});

/* ----------------------Update User Info----------------- */
const updateUserInfo = catchAsync(async (req, res) => {
  const userId = req.user.userId; // Authenticated user's ID
  const updates = req.body;

  const result = await UserServices.updateUserInfo(userId, updates);

  sendResponse(res, 200, {
    message: 'User information updated successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  changePassword,
  updateUserInfo,
};
