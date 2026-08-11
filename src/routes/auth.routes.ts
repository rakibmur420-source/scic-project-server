import express from "express";
import { UserController } from "../services/user/user.controller";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);

export const AuthRoutes = router;
