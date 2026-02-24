import express from "express";
import vaccinationsController from "../controller/vaccinations.controller.js";

const router = express.Router();

router.post("/vaccinations", vaccinationsController.create);
router.get("/vaccinations", vaccinationsController.getAll);
router.get("/vaccinations/due", vaccinationsController.getDueVaccinations);
router.get("/vaccinations/pet/:pet_id", vaccinationsController.getByPetId);
router.get("/vaccinations/:id", vaccinationsController.getById);
router.put("/vaccinations/:id", vaccinationsController.update);
router.delete("/vaccinations/:id", vaccinationsController.delete);

export default router;
