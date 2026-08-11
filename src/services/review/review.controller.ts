import { Request, Response } from "express";
import catchAsync from "../../lib/catchAsync";
import sendResponse from "../../lib/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(req.user!.id, req.body);
  sendResponse(res, 201, {
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, productId } = req.query;
  const result = await ReviewService.getAllReviews({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    productId: productId as string,
  });
  sendResponse(res, 200, {
    success: true,
    message: "Reviews retrieved successfully",
    data: result.reviews,
    meta: result.meta,
  });
});

const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getReviewById((req.params.id as string));
  sendResponse(res, 200, {
    success: true,
    message: "Review retrieved successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.updateReview((req.params.id as string), req.user!.id, req.body);
  sendResponse(res, 200, {
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  await ReviewService.deleteReview((req.params.id as string), req.user!.id, req.user!.role);
  sendResponse(res, 200, {
    success: true,
    message: "Review deleted successfully",
    data: null,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
