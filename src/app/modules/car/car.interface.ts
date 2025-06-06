import { Model } from 'mongoose';

export type TCarCategory = 'sedan' | 'suv' | 'sports' | 'coupe' | 'convertible';

export type TCar = {
  carName: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: TCarCategory;
  description: string;
  quantity: number;
  productImg?: string;
  inStock: boolean;
};

export interface CarModel extends Model<TCar> {
  isCarExists(
    carName: string,
    brand: string,
    model: string,
    year: number,
    category: string,
  ): Promise<TCar | null>;
}
