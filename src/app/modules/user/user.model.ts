import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, 
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    profileImg: { type: String, default: '' },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    bio: { type: String },
    phone: { type: String },
    dateOfBirth: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    website: { type: String },
    occupation: { type: String },
    company: { type: String },
    timezone: { type: String },
    language: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* --------------- Document Middleware ------------------------- */

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// ---------Set Empty sting after setting password
userSchema.post('save', function (doc, next) {
  doc.password = '';

  next();
});

// ----------Check if the user exists by email
userSchema.statics.isUserExistByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

// ----------Check if the password match with the actual password
userSchema.statics.isPasswordMatched = async function (
  userInputPassword,
  storedHashedPassword,
) {
  return await bcrypt.compare(userInputPassword, storedHashedPassword);
};

// ----------Check if the Token issued before password changed
userSchema.statics.isJwtTokenIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTimeInSeconds =
    new Date(passwordChangedTimestamp).getTime() / 1000;

  return passwordChangedTimeInSeconds > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
