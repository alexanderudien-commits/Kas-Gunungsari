import { Router } from "express";
import { TransactionController } from '../controllers/transaction.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get("/", TransactionController.getAll);
router.post("/", TransactionController.create);
router.put("/:id", TransactionController.update);
router.delete("/:id", TransactionController.delete);

export default router;
