import { model, Schema } from 'mongoose';
import { TCar, CarModel } from './car.interface';

const carSchema = new Schema<TCar, CarModel>(
  {
    carName: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1800,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: {
        values: ['sedan', 'suv', 'sports', 'coupe', 'convertible'],
        message: '{VALUE} is not a valid category.',
      },
      required: [true, 'car category is required.'],
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    productImg: { type: String, default: '' },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Find it the card existing or not ------
carSchema.statics.isCarExists = async function (
  carName: string,
  brand: string,
  model: string,
  year: number,
  category: string,
) {
  const existingCar = await Car.findOne({ carName, brand, model, year, category });
  return existingCar;
};

export const Car = model<TCar, CarModel>('Car', carSchema);
