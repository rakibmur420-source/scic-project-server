import prisma from "../../lib/prisma";
import ApiError from "../../lib/ApiError";

const createReview = async (
  userId: string,
  payload: { rating: number; comment?: string; productId: string }
) => {
  const product = await prisma.product.findFirst({
    where: { id: payload.productId, isDeleted: false },
  });
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  if (payload.rating < 1 || payload.rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5.");
  }

  return prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      productId: payload.productId,
      userId,
    },
  });
};

const getAllReviews = async (query: { page?: number; limit?: number; productId?: string }) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = { isDeleted: false };
  if (query.productId) where.productId = query.productId;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true } }, product: { select: { id: true, name: true } } },
    }),
    prisma.review.count({ where }),
  ]);

  return { reviews, meta: { page, limit, total } };
};

const getReviewById = async (id: string) => {
  const review = await prisma.review.findFirst({
    where: { id, isDeleted: false },
    include: { user: { select: { id: true, name: true } }, product: true },
  });
  if (!review) {
    throw new ApiError(404, "Review not found.");
  }
  return review;
};

const updateReview = async (
  id: string,
  userId: string,
  payload: Partial<{ rating: number; comment: string }>
) => {
  const review = await prisma.review.findFirst({ where: { id, isDeleted: false } });
  if (!review) {
    throw new ApiError(404, "Review not found.");
  }
  if (review.userId !== userId) {
    throw new ApiError(403, "You can only update your own review.");
  }

  return prisma.review.update({ where: { id }, data: payload });
};

const deleteReview = async (id: string, userId: string, role: string) => {
  const review = await prisma.review.findFirst({ where: { id, isDeleted: false } });
  if (!review) {
    throw new ApiError(404, "Review not found.");
  }
  if (review.userId !== userId && role !== "ADMIN") {
    throw new ApiError(403, "You can only delete your own review.");
  }

  await prisma.review.update({ where: { id }, data: { isDeleted: true } });
  return null;
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
