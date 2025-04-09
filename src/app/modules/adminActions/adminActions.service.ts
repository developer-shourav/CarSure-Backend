import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { Blog } from '../blog/blog.model';

/* --------Logic For Block An User------ */
const blockUserFromDB = async (id: string) => {
  /* ----------find The User Exist Or Not--------------- */
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  const result = await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!result) {
    throw new AppError(400, 'User block failed');
  }

  return result;
};
/* --------Logic For Delete a Blog------ */
const deleteBlogFromDB = async (id: string) => {
  /* ----------find The Blog Exist Or Not--------------- */
  const isBlogExist = await Blog.findById(id);
  if (!isBlogExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog is not found');
  }

  const result = await Blog.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(400, 'Blog delete failed');
  }

  return result;
};

export const AdminActionsServices = {
  blockUserFromDB,
  deleteBlogFromDB,
};
