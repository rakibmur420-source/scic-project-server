import prisma from "../../lib/prisma";
import ApiError from "../../lib/ApiError";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";

const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}) => {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) {
    throw new ApiError(400, "A user with this email already exists.");
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone,
      address: payload.address,
    },
  });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

const loginUser = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findFirst({
    where: { email: payload.email, isDeleted: false },
  });

  if (!user) {
    throw new ApiError(404, "No account found with this email.");
  }

  const isPasswordValid = await comparePassword(payload.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password.");
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

const getAllUsers = async (query: { page?: number; limit?: number }) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { isDeleted: false },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where: { isDeleted: false } }),
  ]);

  return { users, meta: { page, limit, total } };
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
};

const updateUser = async (
  id: string,
  payload: Partial<{ name: string; phone: string; address: string }>
) => {
  const user = await prisma.user.findFirst({ where: { id, isDeleted: false } });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const updated = await prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      updatedAt: true,
    },
  });

  return updated;
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.findFirst({ where: { id, isDeleted: false } });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  await prisma.user.update({
    where: { id },
    data: { isDeleted: true },
  });

  return null;
};

export const UserService = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
