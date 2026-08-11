import express from "express";
import { ProductController } from "../services/product/product.controller";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/", auth("ADMIN"), ProductController.createProduct);
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.patch("/:id", auth("ADMIN"), ProductController.updateProduct);
router.delete("/:id", auth("ADMIN"), ProductController.deleteProduct);

export const ProductRoutes = router;
