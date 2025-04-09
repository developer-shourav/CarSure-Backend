import { TCar } from './car.interface';
import { Car } from './car.model';

/* --------Logic For add a car to DataBase------ */
const addNewCarIntoDB = async (carData: TCar) => {
  // Check The same car already exist or not
  if (
    await Car.isCarExists(
      carData.brand,
      carData.model,
      carData.year,
      carData.category,
    )
  ) {
    throw new Error('Car already exist!');
  }
  const result = await Car.create(carData);
  return result;
};
/* --------------Logic For get all cars form Database --------- */
const getAllCarsFromDB = async () => {
  const result = await Car.find();
  return result;
};

/* --------------Logic For get single car form Database --------- */
const getSingleCarFromDB = async (carId: string) => {
  const result = await Car.findOne({ _id: carId });
  if (!result) {
    throw new Error('Car not found!');
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
    throw new Error('Car not found!');
  }
  return updatedCar;
};

/* --------------Logic For get single car form Database --------- */
const deleteSingleCarFromDB = async (carId: string) => {
  const deleteCar = await Car.findByIdAndDelete({ _id: carId });
  if (!deleteCar) {
    throw new Error('Car not found!');
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
