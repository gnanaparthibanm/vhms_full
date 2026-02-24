import express from "express";
import followUpsController from "../controller/followups.controller.js";

const router = express.Router();

router.post("/followups", followUpsController.create);
router.get("/followups", followUpsController.getAll);
router.get("/followups/upcoming", followUpsController.getUpcoming);
router.get("/followups/:id", followUpsController.getById);
router.put("/followups/:id", followUpsController.update);
router.delete("/followups/:id", followUpsController.delete);

export default router;
