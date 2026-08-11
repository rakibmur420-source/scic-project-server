import prisma from "../../lib/prisma";
import ApiError from "../../lib/ApiError";
import type { Prisma } from "@prisma/client";

interface OrderItemInput {
  productId: string;
  quantity: number;
}

const createOrder = async (userId: string, payload: { items: OrderItemInput[]; address?: string }) => {
  if (!payload.items || payload.items.length === 0) {
    throw new ApiError(400, "Order must contain at least one item.");
  }

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    let totalAmount = 0;
    const orderItemsData: { productId: string; quantity: number; price: number }[] = [];

    for (const item of payload.items) {
      const product = await tx.product.findFirst({
        where: { id: item.productId, isDeleted: false },
      });

      if (!product) {
        throw new ApiError(404, `Product not found: ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for product: ${product.name}`);
      }

      totalAmount += product.price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        address: payload.address,
        orderItems: { create: orderItemsData },
      },
      include: { orderItems: { include: { product: true } } },
    });

    return order;
  });
};

const getAllOrders = async (query: {
  page?: number;
  limit?: number;
  userId?: string;
  status?: string;
}) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = { isDeleted: false };
  if (query.userId) where.userId = query.userId;
  if (query.status) where.status = query.status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, meta: { page, limit, total } };
};

const getOrderById = async (id: string) => {
  const order = await prisma.order.findFirst({
    where: { id, isDeleted: false },
    include: {
      orderItems: { include: { product: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }
  return order;
};

const updateOrderStatus = async (
  id: string,
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) => {
  const order = await prisma.order.findFirst({ where: { id, isDeleted: false } });
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  return prisma.order.update({ where: { id }, data: { status } });
};

const deleteOrder = async (id: string) => {
  const order = await prisma.order.findFirst({ where: { id, isDeleted: false } });
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  await prisma.order.update({ where: { id }, data: { isDeleted: true } });
  return null;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
