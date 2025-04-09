import { Response } from 'express';

type TResponse<T> = {
  message?: string;
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
    data: responseData.data,
  });
};

export default sendResponse;
