import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blog.service';
/* ----------------------Create A Blog----------------- */
const createBlog = catchAsync(async (req, res) => {
  const blogData = req.body;
  const user = req.user;

  // will call service function to send this data
  const result = await BlogServices.createBlogIntoDB(user?.userEmail, blogData);

  sendResponse(res, 201, {
    message: 'Blog created successfully',
    data: result,
  });
});

/* ----------------------Update A Blog----------------- */
const updateBlog = catchAsync(async (req, res) => {
  const blogUpdateData = req.body;
  const { id } = req.params;
  const { userId } = req.user;

  // will call service function to send this data
  const result = await BlogServices.updateBlogFromDB(
    userId,
    id,
    blogUpdateData,
  );

  sendResponse(res, httpStatus.OK, {
    message: 'Blog updated successfully',
    data: result,
  });
});

/* ----------------------Delete A Blog----------------- */
const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  // will call service function to send this data
  await BlogServices.deleteBlogFromDB(userId, id);

  sendResponse(res, httpStatus.OK, {
    message: 'Blog deleted successfully',
  });
});

/* ----------------------Get All Blogs----------------- */
const getAllBlogs = catchAsync(async (req, res) => {
  const query = req.query;
  // will call service function to send this data
  const result = await BlogServices.getAllBlogsFromDB(query);

  sendResponse(res, httpStatus.OK, {
    message: 'Blogs fetched successfully',
    data: result,
  });
});

export const BlogControllers = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
};
