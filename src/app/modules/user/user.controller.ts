import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
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

export const UserControllers = {
  createUser,
  getAllUsers,
};
