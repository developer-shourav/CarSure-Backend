/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { hostImageToCloudinary } from '../../utils/hostImageToCloudinary';
import { TCar } from './car.interface';
import { Car } from './car.model';
import { uniqueCarImageNameGenerator } from '../../utils/uniqueImageNameGenerator';
import QueryBuilder from '../../builder/QueryBuilder';

/* --------Logic For add a car to DataBase------ */
const addNewCarIntoDB = async (imageFileDetails: any, carData: TCar) => {
  // Check The same car already exist or not
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

  // ----------send Image to the cloudinary----------
  if (imageFileDetails) {
    const imagePath = imageFileDetails?.path;
    const { imageName } = uniqueCarImageNameGenerator(
      carData.carName,
      carData.brand,
      carData.model,
      carData.year,
    );
    const { secure_url } = await hostImageToCloudinary(imageName, imagePath);

    carData.productImg = secure_url as string;
  }

  const result = await Car.create(carData);
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
  const result = await carQuery.queryModel;
  const meta = await carQuery.countTotal();
  return { meta, result };
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
  const updatedCar = await Car.findByIdAndUpdate(
    carId,
    carUpdates,
    { new: true, runValidators: true }, // Return the updated document and apply validation
  );
  if (!updatedCar) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found!');
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
