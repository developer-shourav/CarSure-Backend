/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCar } from './car.interface';
import { Car } from './car.model';
import QueryBuilder from '../../builder/QueryBuilder';

/* --------Logic For add a car to DataBase------ */
const addNewCarIntoDB = async (carData: TCar) => {
  // Check if the car already exists
  if (
    await Car.isCarExists(
      carData.carName,
      carData.brand,
      carData.model,
      carData.year,
      carData.category,
    )
  ) {
    throw new AppError(httpStatus.CONFLICT, 'Car already exist!');
  }

  // Normalize productImg to always be an array
  let normalizedProductImg: string[] | undefined;

  if (typeof carData.productImg === 'string') {
    normalizedProductImg = carData.productImg ? [carData.productImg] : [];
  } else if (Array.isArray(carData.productImg)) {
    normalizedProductImg = carData.productImg;
  }

  // Create the car
  const result = await Car.create({
    ...carData,
    productImg: normalizedProductImg,
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create car!');
  }

  return result;
};

/* --------------Logic For get all cars form Database --------- */
const getAllCarsFromDB = async (query: Record<string, unknown>) => {
  const carSearchFields = [
    "carName",
    "brand",
    "model",
    "description",
  ];

  // Search, Filter, Sort, Pagination and Field Filtering Using Query Chaining Method
  const carQuery = new QueryBuilder(
    Car.find(),
    query,
  )
    .search(carSearchFields)
    .filter()
    .sortBy()
    .pagination()
    .fieldFiltering();
  const data = await carQuery.queryModel;
  const meta = await carQuery.countTotal();
  return { meta, data };
};


/* --------------Logic For get single car form Database --------- */
const getSingleCarFromDB = async (carId: string) => {
  const result = await Car.findOne({ _id: carId });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found!');
  }
  return result;
};

/* -------------Logic for update a single car------------------ */
const updateSingleCarFromDB = async (
  carId: string,
  carUpdates: Partial<TCar>,
) => {
  const updateData: Partial<TCar> = { ...carUpdates };

  // Check if the car exists
  const existingCar = await Car.findById(carId);
  if (!existingCar) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found!');
  }

  // Normalize productImg if present
  if ('productImg' in carUpdates) {
    if (typeof carUpdates.productImg === 'string') {
      updateData.productImg = carUpdates.productImg
        ? [carUpdates.productImg]
        : [];
    } else if (Array.isArray(carUpdates.productImg)) {
      updateData.productImg = carUpdates.productImg;
    }
  }

  const updatedCar = await Car.findByIdAndUpdate(
    carId,
    updateData,
    { new: true, runValidators: true },
  );

  if (!updatedCar) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update car!');
  }

  return updatedCar;
};


/* --------------Logic For get single car form Database --------- */
const deleteSingleCarFromDB = async (carId: string) => {
  const deleteCar = await Car.findByIdAndDelete({ _id: carId });
  if (!deleteCar) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found!');
  }
  return deleteCar;
};

export const carServices = {
  addNewCarIntoDB,
  getAllCarsFromDB,
  getSingleCarFromDB,
  updateSingleCarFromDB,
  deleteSingleCarFromDB,
};
