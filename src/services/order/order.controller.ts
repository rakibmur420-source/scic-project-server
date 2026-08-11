import { Request, Response } from "express";
import catchAsync from "../../lib/catchAsync";
import sendResponse from "../../lib/sendResponse";
import { OrderService } from "./order.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrder(req.user!.id, req.body);
  sendResponse(res, 201, {
    success: true,
    message: "Order placed successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, userId, status } = req.query;
  // Non-admins can only see their own orders
  const effectiveUserId = req.user!.role === "ADMIN" ? (userId as string) : req.user!.id;

  const result = await OrderService.getAllOrders({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    userId: effectiveUserId,
    status: status as string,
  });
  sendResponse(res, 200, {
    success: true,
    message: "Orders retrieved successfully",
    data: result.orders,
    meta: result.meta,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getOrderById((req.params.id as string));
  sendResponse(res, 200, {
    success: true,
    message: "Order retrieved successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.updateOrderStatus((req.params.id as string), req.body.status);
  sendResponse(res, 200, {
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  await OrderService.deleteOrder((req.params.id as string));
  sendResponse(res, 200, {
    success: true,
    message: "Order deleted successfully",
    data: null,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
