import { z } from 'zod';
import { Types } from 'mongoose';

// Enum for status values
const statusEnum = z.enum(["Pending", "Paid", "Shipped", "Completed", "Cancelled"]);

// Optional nested transaction schema
const transactionSchema = z.object({
  id: z.string().optional(),
  transactionStatus: z.string().optional(),
  bank_status: z.string().optional(),
  sp_code: z.string().optional(),
  sp_message: z.string().optional(),
  method: z.string().optional(),
  date_time: z.string().optional(),
}).optional();

// -------------------- Create Order Validation --------------------
const orderValidationSchema = z.object({
  body: z.object({
    user: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), 'Invalid user ObjectId'),
    carId: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), 'Invalid car ObjectId'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    totalPrice: z.number().min(1, 'Total price must be more than 0'),
    status: statusEnum.optional(),
    transaction: transactionSchema,
  })
});

// -------------------- Update Order Validation --------------------
const orderUpdateValidationSchema = z.object({
  body: z.object({
    user: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), 'Invalid user ObjectId')
      .optional(),
    carId: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), 'Invalid car ObjectId')
      .optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1').optional(),
    totalPrice: z.number().min(1, 'Total price must be more than 0').optional(),
    status: statusEnum.optional(),
    transaction: transactionSchema,
  })
});

export const OrderValidation = {
  orderValidationSchema,
  orderUpdateValidationSchema,
};
