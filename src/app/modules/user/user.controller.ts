import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
/* ----------------------Create An User----------------- */
const createUser = catchAsync(async (req, res) => {
  const userData = req.body;
  // will call service function to send this data
  const result = await UserServices.createUserIntoDB(userData);

  sendResponse(res, 201, {
    message: 'User is created successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
};
