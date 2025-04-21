import { carServices } from './car.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

/* --------------------Add a new car ----------------- */
const addNewCar = catchAsync(async (req, res) => {
  /* ------Raw data of the request------ */
  const addNewCarData = req.body;

  /* ----------Store data to Database -------- */
  const result = await carServices.addNewCarIntoDB(
    addNewCarData,
  );

  sendResponse(res, 201, {
    message: 'Car created successfully',
    data: result,
  });
});

/* -----------------Get All Cars------------------------- */
const getAllCars = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await carServices.getAllCarsFromDB(query);

  sendResponse(res, httpStatus.OK, {
    message: 'Cars retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

/* -----------------Get single Car------------------------- */
const getSingleCar = catchAsync(async (req, res) => {
  const { carId } = req.params;
  const result = await carServices.getSingleCarFromDB(carId);

  sendResponse(res, httpStatus.OK, {
    message: 'Car retrieved successfully',
    data: result,
  });
});

/* -----------------Update A Car------------------------- */
const updateACar = catchAsync(async (req, res) => {
  const { carId } = req.params;
  const carUpdates = req.body;

  //----- Update the car in the database-----
  const result = await carServices.updateSingleCarFromDB(carId, carUpdates);

  /* ----Send success response to frontend ------ */
  sendResponse(res, httpStatus.OK, {
    message: 'Car updated successfully',
    data: result,
  });
});

/* -----------------Delete single Car------------------------- */
const deleteSingleCar = catchAsync(async (req, res) => {
  const { carId } = req.params;
  await carServices.deleteSingleCarFromDB(carId);

  /* ----Send success response to frontend ------ */
  sendResponse(res, httpStatus.OK, {
    message: 'Car deleted successfully',
    data: {},
  });
});

export const CarControllers = {
  addNewCar,
  getAllCars,
  getSingleCar,
  updateACar,
  deleteSingleCar,
};
