import { Types } from 'mongoose';

export type TOrder = {
  user: Types.ObjectId;
  carId: Types.ObjectId;
  customerInfo: {
    name: string;
    address: string;
    email: string;
    phone: string;
    city: string;
    userIP: string;
  };
  quantity: number;
  totalPrice: number;
  status: "Pending" | "Paid" | "Shipped" | "Completed" | "Cancelled";
  transaction?: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
};
