import {
  carUpdateValidationSchema,
  carValidationSchema,
} from './car.validation';
import { carServices } from './car.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

/* --------------------Add a new car ----------------- */
const addNewCar = catchAsync(async (req, res) => {
  /* ------Raw data of the request------ */
  const addNewCarData = req.body;

  /* -----Data Validation with zod------- */
  const carDataZodValidationResult = carValidationSchema.parse(addNewCarData);

  /* ----------Store data to Database -------- */
  const result = await carServices.addNewCarIntoDB(
    carDataZodValidationResult,
  );

  sendResponse(res, 201, {
    message: 'Car created successfully',
    data: result,
  });
});

/* -----------------Get All Cars------------------------- */
const getAllCars = catchAsync(async (req, res) => {

  const result = await carServices.getAllCarsFromDB();

  sendResponse(res, 200, {
    message: 'Cars retrieved successfully',
    data: result,
  });
});

/* -----------------Get single Car------------------------- */
const getSingleCar = catchAsync(async (req, res) => {
  const { carId } = req.params;
  const result = await carServices.getSingleCarFromDB(carId);

  sendResponse(res, 200, {
    message: 'Car retrieved successfully',
    data: result,
  });
});

/* -----------------Update A Car------------------------- */
const updateACar = catchAsync(async (req, res) => {
  const { carId } = req.params;
  const carUpdates = carUpdateValidationSchema.parse(req.body);

  //----- Update the car in the database-----
  const result = await carServices.updateSingleCarFromDB(carId, carUpdates);

  /* ----Send success response to frontend ------ */
  sendResponse(res, 200, {
    message: 'Car updated successfully',
    data: result,
  });
});

/* -----------------Delete single Car------------------------- */
const deleteSingleCar = catchAsync(async (req, res) => {
  const { carId } = req.params;
  await carServices.deleteSingleCarFromDB(carId);

  /* ----Send success response to frontend ------ */
  sendResponse(res, 200, {
    message: 'Car deleted successfully',
    data: {},
  });
})

export const CarControllers = {
  addNewCar,
  getAllCars,
  getSingleCar,
  updateACar,
  deleteSingleCar,
};
