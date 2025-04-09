import { Request, Response } from 'express';
import {
  carUpdateValidationSchema,
  carValidationSchema,
} from './car.validation';
import { carServices } from './car.service';

/* --------------------Add a new car ----------------- */
const addNewCar = async (req: Request, res: Response) => {
  try {
    /* ------Raw data of the request------ */
    const addNewCarData = req.body;

    /* -----Data Validation with zod------- */
    const carDataZodValidationResult = carValidationSchema.parse(addNewCarData);

    /* ----------Store data to Database -------- */
    const result = await carServices.addNewCarIntoDB(
      carDataZodValidationResult,
    );

    /* ----Send success response to frontend ------ */
    res.status(200).json({
      message: 'Car created successfully',
      success: true,
      data: result,
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      /* ----------Handle validation errors from Zod---------- */
      res.status(400).json({
        message: 'Validation failed',
        success: false,
        error: {
          name: 'ValidationError',
          errors: err.errors,
        },
        stack: err.stack,
      });
    } else {
      /* ----------Handle other errors (e.g., DB errors, etc.) ---------- */
      const errorName = err.name || 'InternalServerError';
      const errorMessage =
        err.message || 'An unexpected error occurred on the server.';

      res.status(500).json({
        message: errorMessage,
        success: false,
        error: {
          name: errorName,
          details: err,
        },
        stack: err.stack,
      });
    }
  }
};

/* -----------------Get All Cars------------------------- */
const getAllCars = async (req: Request, res: Response) => {
  try {
    const result = await carServices.getAllCarsFromDB();

    /* ----Send success response to frontend ------ */
    res.status(200).json({
      message: 'Cars retrieved successfully',
      status: true,
      data: result,
    });
  } catch (err: any) {
    // ------ If error occurs then give error response to the Fronted
    res.status(500).json({
      message: err.message || 'Something went wrong!',
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

/* -----------------Get single Car------------------------- */
const getSingleCar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const result = await carServices.getSingleCarFromDB(carId);

    /* ----Send success response to frontend ------ */
    res.status(200).json({
      message: 'Car retrieved successfully',
      status: true,
      data: result,
    });
  } catch (err: any) {
    // ------ If error occurs then give error response to the Fronted
    res.status(err.message === 'Car not found!' ? 404 : 500).json({
      message: err.message || 'Something went wrong!',
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

/* -----------------Update A Car------------------------- */
const updateACar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const carUpdates = carUpdateValidationSchema.parse(req.body);

    //----- Update the car in the database-----
    const result = await carServices.updateSingleCarFromDB(carId, carUpdates);

    /* ----Send success response to frontend ------ */
    res.status(200).json({
      message: 'Car updated successfully',
      status: true,
      data: result,
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      /* ------ Handle validation errors ------*/
      res.status(400).json({
        message: 'Validation failed',
        success: false,
        error: err.errors,
      });
    } else {
      /* ------Handle other errors (e.g., DB errors, etc.) ------ */
      const errorName = err.name || 'InternalServerError';
      const errorMessage =
        err.message || 'An unexpected error occurred on the server.';

      res.status(errorMessage === 'Car not found!' ? 404 : 500).json({
        message: errorMessage,
        success: false,
        error: {
          name: errorName,
          details: err,
        },
        stack: err.stack,
      });
    }
  }
};

/* -----------------Delete single Car------------------------- */
const deleteSingleCar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    await carServices.deleteSingleCarFromDB(carId);

    /* ----Send success response to frontend ------ */
    res.status(200).json({
      message: 'Car deleted successfully',
      status: true,
      data: {},
    });
  } catch (err: any) {
    // ------ If error occurs then give error response to the Fronted
    res.status(err.message === 'Car not found!' ? 404 : 500).json({
      message: err.message || 'Something went wrong!',
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

export const CarControllers = {
  addNewCar,
  getAllCars,
  getSingleCar,
  updateACar,
  deleteSingleCar,
};
