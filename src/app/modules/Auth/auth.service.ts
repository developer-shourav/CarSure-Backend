/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { createToken } from './auth.utils';
import jwt from 'jsonwebtoken';
import { uniqueUserImageNameGenerator } from '../../utils/uniqueImageNameGenerator';
import { hostImageToCloudinary } from '../../utils/hostImageToCloudinary';

/* --------Logic For Register an User ---------- */
const registerUserIntoDB = async (imageFileDetails: any,  payload: TUser) => {

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

/* ---------- Logic for Login an User ----------*/
const logInUser = async (payload: { email: string; password: string }) => {
  // ----------Check if the user is exist
  const user = await User.isUserExistByEmail(payload?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // --------- checking if the user is Blocked
  const userStatus = user?.isBlocked;
  if (userStatus) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked!');
  }

  // ----------Checking if the password Match or Not

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(401, 'Invalid credentials');
  }

  // ----------Create token and send to the client
  const jwtPayload = {
    userId: user?._id,
    userEmail: user?.email,
    role: user?.role,
  };
  // --- Create AccessToken
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  // --- Create RefreshToken
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (TOKEN: string) => {
  /* -------Checking the token validity */
  const decoded = jwt.verify(
    TOKEN,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userEmail } = decoded;

  // ----------Check if the user is exist
  const user = await User.isUserExistByEmail(userEmail);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // --------- checking if the user is Blocked
  const userStatus = user?.isBlocked;
  if (userStatus) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked!');
  }

  // ----------Create token and send to the client
  const jwtPayload = {
    userId: user?._id,
    userEmail: user?.email,
    role: user?.role,
  };
  // --- Create AccessToken
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  registerUserIntoDB,
  logInUser,
  refreshToken,
};
