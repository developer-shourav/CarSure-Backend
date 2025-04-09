import mongoose from 'mongoose';
import { TUser } from './user.interface';
import { User } from './user.model';

import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

/* --------Logic For Create a User------ */
const createUserIntoDB = async (payload: TUser) => {
  const user = await User.isUserExistByEmail(payload?.email);
  if (user) {
    throw new AppError(400, 'Email is already used.');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newUser = await User.create([payload], { session });

    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }

    await session.commitTransaction();
    await session.endSession();

    //---------- Extract only required fields
    const userData = {
      _id: newUser[0]?._id,
      name: newUser[0]?.name,
      email: newUser[0]?.email,
    };

    return userData;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(`${err}`);
  }
};

export const UserServices = {
  createUserIntoDB,
};
