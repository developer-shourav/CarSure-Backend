import { z } from 'zod';
import { Types } from 'mongoose';

// -------------- Define a zod schema for the `Order` model --------------
export const orderValidationSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
  car: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), 'Invalid car ObjectId'), // Validates as a MongoDB ObjectId
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  totalPrice: z.number().min(1, 'Total price must be more than 0'),
});
