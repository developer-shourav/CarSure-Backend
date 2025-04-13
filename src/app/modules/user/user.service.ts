/* eslint-disable @typescript-eslint/no-explicit-any */
import { TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { hostImageToCloudinary } from '../../utils/hostImageToCloudinary';
import { uniqueUserImageNameGenerator } from '../../utils/uniqueImageNameGenerator';

/* --------Logic For Create a User------ */
const createUserIntoDB = async (imageFileDetails: any, payload: TUser) => {
  const user = await User.isUserExistByEmail(payload?.email);
  if (user) {
    throw new AppError(400, 'Email is already used.');
  }

  // ----------send Image to the cloudinary----------
  if (imageFileDetails) {
    const imagePath = imageFileDetails?.path;
    const { imageName } = uniqueUserImageNameGenerator(payload.name);
    const { secure_url } = await hostImageToCloudinary(imageName, imagePath);
    payload.profileImg = secure_url as string;
  }
  const result = await User.create(payload);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
  }

  return result;
};

/* ---------------------Get All Users from Database------------------- */
const getAllUsersFromBD = async () => {
  const result = User.find();
  if (!result) {
    throw new AppError(404, 'Users not found!');
  }
  return result;
};
export const UserServices = {
  createUserIntoDB,
  getAllUsersFromBD,
};
