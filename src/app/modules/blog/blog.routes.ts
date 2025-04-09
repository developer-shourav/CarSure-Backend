import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { blogValidation } from './blog.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { BlogControllers } from './blog.controller';

const router = express.Router();

// -----------Create A Blog------------
router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(blogValidation.blogValidationSchema),
  BlogControllers.createBlog,
);

// -----------Update A Blog------------
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(blogValidation.blogUpdateValidationSchema),
  BlogControllers.updateBlog,
);

// -----------Delete A Blog------------
router.delete('/:id', auth(USER_ROLE.user), BlogControllers.deleteBlog);

// -----------Get All Blogs------------
router.get('/', BlogControllers.getAllBlogs);

export const BlogRoutes = router;
