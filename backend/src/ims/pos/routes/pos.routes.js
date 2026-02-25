import express from "express";
import posController from "../controller/pos.controller.js";
import { verifyToken } from "../../../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken());

// CRUD routes
router.post("/", posController.create);
router.get("/", posController.getAll);
router.get("/:id", posController.getById);
router.put("/:id", posController.update);
router.delete("/:id", posController.delete);

export default router;
