import express from "express";
import { OrderController } from "../services/order/order.controller";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/", auth("USER", "ADMIN"), OrderController.createOrder);
router.get("/", auth("USER", "ADMIN"), OrderController.getAllOrders);
router.get("/:id", auth("USER", "ADMIN"), OrderController.getOrderById);
router.patch("/:id/status", auth("ADMIN"), OrderController.updateOrderStatus);
router.delete("/:id", auth("ADMIN"), OrderController.deleteOrder);

export const OrderRoutes = router;
