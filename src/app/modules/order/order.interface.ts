import { Types } from 'mongoose';

export type TOrder = {
  user: Types.ObjectId;
  productDetails: Types.ObjectId;
  quantity: number;
  totalPrice: number;
};
