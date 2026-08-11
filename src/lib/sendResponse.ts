import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

const sendResponse = <T>(res: Response, statusCode: number, payload: ApiResponse<T>) => {
  return res.status(statusCode).json({
    success: payload.success,
    message: payload.message,
    meta: payload.meta,
    data: payload.data ?? null,
  });
};

export default sendResponse;
