import { NextFunction, Request, Response } from 'express';

export const formDataToJsonConvertor = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const newRequestData = req.body.formData;
  req.body = JSON.parse(newRequestData);
  next();
};
