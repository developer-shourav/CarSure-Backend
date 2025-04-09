import { model, Schema } from 'mongoose';
import { TCar, CarModel } from './car.interface';

const carSchema = new Schema<TCar, CarModel>(
  {
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
        values: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'],
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
  brand: string,
  model: string,
  year: number,
  category: string,
) {
  const existingCar = await Car.findOne({ brand, model, year, category });
  return existingCar;
};

export const Car = model<TCar, CarModel>('Car', carSchema);
