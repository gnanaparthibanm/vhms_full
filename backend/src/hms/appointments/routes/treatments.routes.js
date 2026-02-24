import express from "express";
import treatmentsController from "../controller/treatments.controller.js";

const router = express.Router();

router.post("/treatments", treatmentsController.create);
router.get("/treatments", treatmentsController.getAll);
router.get("/treatments/:id", treatmentsController.getById);
router.put("/treatments/:id", treatmentsController.update);
router.delete("/treatments/:id", treatmentsController.delete);

export default router;
