import express from "express";
import billableItemController from "../controller/billableitem.controller.js";
import { verifyToken } from "../../../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken());

// CRUD routes
router.post("/", billableItemController.create);
router.get("/", billableItemController.getAll);
router.get("/:id", billableItemController.getById);
router.put("/:id", billableItemController.update);
router.delete("/:id", billableItemController.delete);

// Stock management
router.put("/:id/stock", billableItemController.updateStock);

export default router;
