import { Router } from "express";
import { BudgetController } from '../controllers/budget.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get("/", BudgetController.getAll);
router.post("/", BudgetController.create);
router.put("/:id", BudgetController.update);
router.delete("/:id", BudgetController.delete);

export default router;
