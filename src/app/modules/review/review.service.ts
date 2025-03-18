import prisma from "../../../prisma/prismaClient";
import ApiError from "../../../errors/ApiErrors";
import { format } from "date-fns";

const createReviewIntoDB = async (payload: {
  userName: string;
  restaurantId: string;
  rating: number;
  comment?: string;
}) => {
  const review = await prisma.review.create({
    data: {
      ...payload,
    },
  });

  return { review };
};

const getAllReviews = async (id?: string) => {
  const filter = id ? { restaurantId: id } : {};
  const reviews = await prisma.review.findMany({
    where: filter,
  });

  if (reviews.length === 0) {
    throw new ApiError(404, "Reviews not found!");
  }

  const ratingCounts = [1, 2, 3, 4, 5].reduce((acc, rating) => {
    acc[rating] = reviews.filter((review) => review.rating === rating).length;
    return acc;
  }, {} as { [key: number]: number });

  const totalReviews = reviews.length;

  const ratingPercentages = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    percentage: ((ratingCounts[rating] / totalReviews) * 100).toFixed(2),
  }));

  const monthWiseReviews = reviews.reduce((acc, review) => {
    const monthKey = format(new Date(review.createdAt), "MMMM");

    if (!acc[monthKey]) {
      acc[monthKey] = { count: 0, ratings: [] };
    }

    acc[monthKey].count += 1;
    acc[monthKey].ratings.push(review.rating);

    return acc;
  }, {} as Record<string, { count: number; ratings: number[] }>);

  return {
    reviews,
    ratingPercentages,
    monthWiseReviews,
  };
};

export default getAllReviews;

export const reviewService = {
  createReviewIntoDB,
  getAllReviews,
};
