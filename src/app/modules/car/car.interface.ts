import { Model } from 'mongoose';

export type TCarCategory = 'Sedan' | 'SUV' | 'Truck' | 'Coupe' | 'Convertible';

export type TCar = {
  brand: string;
  model: string;
  year: number;
  price: number;
  category: TCarCategory;
  description: string;
  quantity: number;
  inStock: boolean;
};

export interface CarModel extends Model<TCar> {
  isCarExists(
    brand: string,
    model: string,
    year: number,
    category: string,
  ): Promise<TCar | null>;
}
