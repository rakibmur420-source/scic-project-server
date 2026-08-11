import { Request, Response } from "express";

const notFound = (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
    data: null,
  });
};

export default notFound;
