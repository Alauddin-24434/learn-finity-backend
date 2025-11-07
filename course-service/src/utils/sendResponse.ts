// utils/sendResponse.ts
import { Response } from "express";

interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export const sendResponse = <T>(res: Response, responseData: IApiResponse<T>) => {
  const { statusCode, success, message, data, meta } = responseData;

  const responseBody: any = {
    success,
    message,
    data,
  };

  if (meta) {
    responseBody.meta = meta;
  }

  res.status(statusCode).json(responseBody);
};
