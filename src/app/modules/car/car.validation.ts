import { z } from 'zod';

// --------------Define a zod schema for the `Car` model--------------
const carValidationSchema = z.object({
  body: z.object({
    carName: z.string().min(1, 'Name is required'),
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.number().int().gte(1800, 'Year must be 1800 or later'), // Year is a whole number and at least 1800
    price: z.number().min(0, 'Price must be a positive number'), // Price is non-negative
    rating: z.number().min(1, 'Rating must be between 1 to 5').optional(), 
    category: z.enum(['sedan', 'suv', 'sports', 'coupe', 'convertible']),
    description: z.string(),
    quantity: z.number().min(1, 'Quantity must be at least 1'), // Quantity is a whole number and non-negative
    productImg: z.string().optional(), // Optional field for product image URL
    inStock: z.boolean(),
  })
});

// -------------For Update Data of car -----------

const carUpdateValidationSchema = z.object({
  body: z.object({
    carName: z.string().min(1, 'Name is required').optional(),
    brand: z.string().min(1, 'Brand is required').optional(),
    model: z.string().min(1, 'Model is required').optional(),
    year: z.number().int().gte(1800, 'Year must be 1800 or later').optional(), // Year is a whole number and at least 1800
    price: z.number().min(0, 'Price must be a positive number').optional(), // Price is non-negative
    rating: z.number().min(1, 'Rating must be between 1 to 5').optional(), 
    category: z
      .enum(['sedan', 'suv', 'sports', 'coupe', 'convertible'])
      .optional(),
    description: z.string().optional(),
    quantity: z.number().min(0, 'Quantity must be at least 1').optional(), // Quantity is a whole number and non-negative
    productImg: z.string().optional(), // Optional field for product image URL
    inStock: z.boolean().optional(),
  })
});

export const CarValidation = {
  carValidationSchema,
  carUpdateValidationSchema,
};
