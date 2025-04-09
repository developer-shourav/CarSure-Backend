import { z } from 'zod';

// --------------Define a zod schema for the `Car` model--------------
export const carValidationSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().gte(1800, 'Year must be 1800 or later'), // Year is a whole number and at least 1800
  price: z.number().min(0, 'Price must be a positive number'), // Price is non-negative
  category: z.enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible']),
  description: z.string(),
  quantity: z.number().min(1, 'Quantity must be at least 1'), // Quantity is a whole number and non-negative
  inStock: z.boolean(),
});

// -------------For Update Data of car -----------
export const carUpdateValidationSchema = carValidationSchema.partial();
