import { Request, Response } from "express";
import catchAsync from "../../lib/catchAsync";
import sendResponse from "../../lib/sendResponse";
import { UserService } from "./user.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.registerUser(req.body);
  sendResponse(res, 201, {
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.loginUser(req.body);
  sendResponse(res, 200, {
    success: true,
    message: "Login successful",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const result = await UserService.getAllUsers({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  sendResponse(res, 200, {
    success: true,
    message: "Users retrieved successfully",
    data: result.users,
    meta: result.meta,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserById((req.params.id as string));
  sendResponse(res, 200, {
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateUser((req.params.id as string), req.body);
  sendResponse(res, 200, {
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await UserService.deleteUser((req.params.id as string));
  sendResponse(res, 200, {
    success: true,
    message: "User deleted successfully",
    data: null,
  });
});

export const UserController = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
