import express from "express";
import prescriptionsController from "../controller/prescriptions.controller.js";

const router = express.Router();

// Prescription Routes
router.post("/prescriptions", prescriptionsController.create);
router.get("/prescriptions", prescriptionsController.getAll);
router.get("/prescriptions/:id", prescriptionsController.getById);
router.put("/prescriptions/:id", prescriptionsController.update);
router.post("/prescriptions/:id/dispense", prescriptionsController.dispense);
router.delete("/prescriptions/:id", prescriptionsController.delete);

export default router;
