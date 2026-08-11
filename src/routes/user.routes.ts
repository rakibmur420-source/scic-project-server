import express from "express";
import { UserController } from "../services/user/user.controller";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/", auth("ADMIN"), UserController.getAllUsers);
router.get("/:id", auth("USER", "ADMIN"), UserController.getUserById);
router.patch("/:id", auth("USER", "ADMIN"), UserController.updateUser);
router.delete("/:id", auth("ADMIN"), UserController.deleteUser);

export const UserRoutes = router;
