import prisma from "../../lib/prisma";
import ApiError from "../../lib/ApiError";

const createProduct = async (payload: {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  imageUrl?: string;
  categoryId: string;
}) => {
  const category = await prisma.category.findFirst({
    where: { id: payload.categoryId, isDeleted: false },
  });
  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  return prisma.product.create({ data: payload });
};

const getAllProducts = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = { isDeleted: false };

  if (query.search) {
    where.name = { contains: query.search, mode: "insensitive" };
  }
  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = query.minPrice;
    if (query.maxPrice) where.price.lte = query.maxPrice;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, meta: { page, limit, total } };
};

const getProductById = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: { category: true, reviews: { where: { isDeleted: false } } },
  });
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }
  return product;
};

const updateProduct = async (
  id: string,
  payload: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: string;
    status: "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";
  }>
) => {
  const product = await prisma.product.findFirst({ where: { id, isDeleted: false } });
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return prisma.product.update({ where: { id }, data: payload });
};

const deleteProduct = async (id: string) => {
  const product = await prisma.product.findFirst({ where: { id, isDeleted: false } });
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  await prisma.product.update({ where: { id }, data: { isDeleted: true } });
  return null;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
