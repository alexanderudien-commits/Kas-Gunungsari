import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", CategoryController.getAll);
router.post("/", CategoryController.create);
router.delete("/:id", CategoryController.delete);

export default router;
