import express from "express";
import { ReviewController } from "../services/review/review.controller";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/", auth("USER", "ADMIN"), ReviewController.createReview);
router.get("/", ReviewController.getAllReviews);
router.get("/:id", ReviewController.getReviewById);
router.patch("/:id", auth("USER", "ADMIN"), ReviewController.updateReview);
router.delete("/:id", auth("USER", "ADMIN"), ReviewController.deleteReview);

export const ReviewRoutes = router;
