import express from "express";
import { CategoryController } from "../services/category/category.controller";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/", auth("ADMIN"), CategoryController.createCategory);
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);
router.patch("/:id", auth("ADMIN"), CategoryController.updateCategory);
router.delete("/:id", auth("ADMIN"), CategoryController.deleteCategory);

export const CategoryRoutes = router;
