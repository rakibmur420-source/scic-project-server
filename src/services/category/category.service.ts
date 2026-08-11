import prisma from "../../lib/prisma";
import ApiError from "../../lib/ApiError";

const createCategory = async (payload: { name: string; description?: string }) => {
  const existing = await prisma.category.findUnique({ where: { name: payload.name } });
  if (existing) {
    throw new ApiError(400, "A category with this name already exists.");
  }

  return prisma.category.create({ data: payload });
};

const getAllCategories = async (query: { page?: number; limit?: number }) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where: { isDeleted: false },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.count({ where: { isDeleted: false } }),
  ]);

  return { categories, meta: { page, limit, total } };
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({ where: { id, isDeleted: false } });
  if (!category) {
    throw new ApiError(404, "Category not found.");
  }
  return category;
};

const updateCategory = async (
  id: string,
  payload: Partial<{ name: string; description: string }>
) => {
  const category = await prisma.category.findFirst({ where: { id, isDeleted: false } });
  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  return prisma.category.update({ where: { id }, data: payload });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findFirst({ where: { id, isDeleted: false } });
  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  await prisma.category.update({ where: { id }, data: { isDeleted: true } });
  return null;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
