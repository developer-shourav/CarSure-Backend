import { z } from 'zod';
import { Types } from 'mongoose';

// -------------- Define a zod schema for the `Order` model --------------
const orderValidationSchema = z.object({
  user: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), 'Invalid user ObjectId'),
  productDetails: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), 'Invalid car ObjectId'), // Validates as a MongoDB ObjectId
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  totalPrice: z.number().min(1, 'Total price must be more than 0'),
});
const orderUpdateValidationSchema = z.object({
  user: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), 'Invalid user ObjectId')
    .optional(),
  productDetails: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), 'Invalid car ObjectId')
    .optional(), // Validates as a MongoDB ObjectId
  quantity: z.number().min(1, 'Quantity must be at least 1').optional(),
  totalPrice: z.number().min(1, 'Total price must be more than 0').optional(),
});

export const OrderValidation = {
  orderValidationSchema,
  orderUpdateValidationSchema,
};
