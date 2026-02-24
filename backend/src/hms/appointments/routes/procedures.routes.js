import express from "express";
import proceduresController from "../controller/procedures.controller.js";

const router = express.Router();

router.post("/procedures", proceduresController.create);
router.get("/procedures", proceduresController.getAll);
router.get("/procedures/:id", proceduresController.getById);
router.put("/procedures/:id", proceduresController.update);
router.delete("/procedures/:id", proceduresController.delete);

export default router;
