/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id?: any;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  profileImg?: string;
  isBlocked: boolean;

  // -------optional profile fields
  bio?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  website?: string;
  occupation?: string;
  company?: string;
  timezone?: string;
  language?: string;
}

export interface UserModel extends Model<TUser> {
  isUserExistByEmail(userEmail: string): Promise<TUser>;
  isPasswordMatched(
    userInputPassword: string,
    storedHashedPassword: string,
  ): Promise<boolean>;
  isJwtTokenIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
