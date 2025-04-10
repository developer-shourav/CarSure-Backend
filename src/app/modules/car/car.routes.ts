import express from 'express';
import { CarControllers } from './car.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CarValidation } from './car.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { upload } from '../../utils/hostImageToCloudinary';
import { formDataToJsonConvertor } from '../../middlewares/formDataToJsonConvertor';
const router = express.Router();

/* -------Create a Car */
router.post(
  '/',
  auth(USER_ROLE.admin),
  upload.single('productImg'),
  formDataToJsonConvertor,
  validateRequest(CarValidation.carValidationSchema),
  CarControllers.addNewCar,
);

/* -------Get All Cars */
router.get('/', CarControllers.getAllCars);

/* -------Get Single Car */
router.get('/:carId', CarControllers.getSingleCar);

/* -------Update A Car */
router.patch(
  '/:carId',
  auth(USER_ROLE.admin),
  validateRequest(CarValidation.carUpdateValidationSchema),
  CarControllers.updateACar,
);

/* -------Delete A Car */
router.delete('/:carId',   auth(USER_ROLE.admin), CarControllers.deleteSingleCar);

export const CarRoutes = router;
