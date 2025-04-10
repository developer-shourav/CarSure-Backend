import { z } from 'zod';

// --------------Define a zod schema for the `Car` model--------------
const carValidationSchema = z.object({
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

const carUpdateValidationSchema = z.object({
  brand: z.string().min(1, 'Brand is required').optional(),
  model: z.string().min(1, 'Model is required').optional(),
  year: z.number().int().gte(1800, 'Year must be 1800 or later').optional(), // Year is a whole number and at least 1800
  price: z.number().min(0, 'Price must be a positive number').optional(), // Price is non-negative
  category: z
    .enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'])
    .optional(),
  description: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1').optional(), // Quantity is a whole number and non-negative
  inStock: z.boolean().optional(),
});

export const CarValidation = {
  carValidationSchema,
  carUpdateValidationSchema,
};
