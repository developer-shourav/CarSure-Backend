import express from 'express';
import { CarControllers } from './car.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CarValidation } from './car.validation';
const router = express.Router();

/* -------Create a Car */
router.post('/', validateRequest(CarValidation.carValidationSchema), CarControllers.addNewCar);

/* -------Get All Cars */
router.get('/', CarControllers.getAllCars);

/* -------Get Single Car */
router.get('/:carId', CarControllers.getSingleCar);

/* -------Update A Car */
router.patch('/:carId', validateRequest(CarValidation.carUpdateValidationSchema), CarControllers.updateACar);

/* -------Delete A Car */
router.delete('/:carId', CarControllers.deleteSingleCar);

export const CarRoutes = router;
