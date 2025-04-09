import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TBlog } from './blog.interface';
import { User } from '../user/user.model';
import { Blog } from './blog.model';
import QueryBuilder from '../../builder/QueryBuilder';

/* --------Logic For Create a Blog------ */
const createBlogIntoDB = async (userEmail: string, payload: TBlog) => {
  const user = await User.isUserExistByEmail(userEmail);
  if (!user) {
    throw new AppError(404, 'Author is not found');
  }

  const authorId = user?._id;
  payload.author = authorId;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newBlog = await Blog.create([payload], { session });

    if (!newBlog) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create blog');
    }

    await session.commitTransaction();
    await session.endSession();

    //---------- Extract only required fields
    const createdBlog = {
      _id: newBlog[0]?._id,
      title: newBlog[0]?.title,
      content: newBlog[0]?.content,
      author: newBlog[0]?.author,
    };

    return createdBlog;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(`${err}`);
  }
};

/* --------Logic For Update a Blog------ */
const updateBlogFromDB = async (
  userId: string,
  id: string,
  payload: Partial<TBlog>,
) => {
  /* ----------find The Blog Exist Or Not--------------- */
  const isBlogExist = await Blog.findById(id);
  if (!isBlogExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog is not found');
  }

  const BlogAuthorId: string = isBlogExist?.author.toString();

  /* --------- checking This blog ownership---------- */
  if (userId !== BlogAuthorId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to update this blog',
    );
  }

  const result = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate('author');

  const blogUpdateResult = {
    _id: result?._id,
    title: result?.title,
    content: result?.content,
    author: result?.author,
  };

  return blogUpdateResult;
};

/* --------Logic For Delete a Blog------ */
const deleteBlogFromDB = async (userId: string, id: string) => {
  /* ----------find The Blog Exist Or Not--------------- */
  const isBlogExist = await Blog.findById(id);
  if (!isBlogExist) {
    throw new AppError(404, 'Blog is not found');
  }

  const BlogAuthorId: string = isBlogExist?.author.toString();

  /* --------- checking This blog ownership---------- */
  if (userId !== BlogAuthorId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to delete this blog',
    );
  }

  const result = await Blog.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(400, 'Blog delete failed');
  }

  return result;
};

/* --------Logic For get all Blogs------ */
const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
  const blogSearchFields = ['title', 'content'];

  // Search, Filter, Sort, Pagination, and Field Filtering Using Query Chaining Method
  const blogQuery = new QueryBuilder(Blog.find().populate('author'), query)
    .search(blogSearchFields)
    .filter()
    .sortBy()
    .pagination()
    .fieldFiltering();

  const result = await blogQuery.queryModel;
  return result;
};

export const BlogServices = {
  createBlogIntoDB,
  updateBlogFromDB,
  deleteBlogFromDB,
  getAllBlogsFromDB,
};
