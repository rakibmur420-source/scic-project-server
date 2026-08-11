import express from "express";
import { AuthRoutes } from "./auth.routes";
import { UserRoutes } from "./user.routes";
import { CategoryRoutes } from "./category.routes";
import { ProductRoutes } from "./product.routes";
import { ReviewRoutes } from "./review.routes";
import { OrderRoutes } from "./order.routes";

const router = express.Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/categories", route: CategoryRoutes },
  { path: "/products", route: ProductRoutes },
  { path: "/reviews", route: ReviewRoutes },
  { path: "/orders", route: OrderRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
