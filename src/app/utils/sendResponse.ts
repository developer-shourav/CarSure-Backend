import { Response } from 'express';

type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

type TResponse<T> = {
  message?: string;
  meta?: TMeta;
  data?: T;
};

const sendResponse = <T>(
  res: Response,
  statusCode: number,
  responseData: TResponse<T>,
) => {
  res.status(statusCode).json({
    success: true,
    message: responseData.message,
    statusCode,
    meta: responseData.meta,
    data: responseData.data,
  });
};

export default sendResponse;
