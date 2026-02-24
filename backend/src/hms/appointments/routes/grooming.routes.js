import express from "express";
import groomingController from "../controller/grooming.controller.js";

const router = express.Router();

// Grooming Sessions
router.post("/grooming", groomingController.create);
router.post("/grooming/recommend", groomingController.recommendGrooming);
router.get("/grooming", groomingController.getAll);
router.get("/grooming/pet/:pet_id/history", groomingController.getPetHistory);
router.get("/grooming/:id", groomingController.getById);
router.put("/grooming/:id", groomingController.update);
router.post("/grooming/:id/start", groomingController.startSession);
router.post("/grooming/:id/complete", groomingController.completeSession);
router.delete("/grooming/:id", groomingController.cancel);

// Grooming Service Status
router.put("/grooming/service/:service_id/status", groomingController.updateServiceStatus);

// Grooming Packages
router.post("/grooming/packages", groomingController.createPackage);
router.get("/grooming/packages", groomingController.getAllPackages);
router.get("/grooming/packages/:id", groomingController.getPackageById);
router.put("/grooming/packages/:id", groomingController.updatePackage);
router.delete("/grooming/packages/:id", groomingController.deletePackage);

export default router;
