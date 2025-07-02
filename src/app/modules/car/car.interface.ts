import { Model } from 'mongoose';

export type TCarCategory = 'sedan' | 'suv' | 'sports' | 'coupe' | 'convertible';

export type TCar = {
  carName: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  rating: number;
  category: TCarCategory;
  description: string;
  quantity: number;
  productImg: string | string[];
  inStock: boolean;
  isDeleted: boolean;
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
