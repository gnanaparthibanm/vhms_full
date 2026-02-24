import express from "express";
import billsController from "../controller/bills.controller.js";

const router = express.Router();

router.post("/bills", billsController.create);
router.get("/bills", billsController.getAll);
router.get("/bills/reports/tax/monthly", billsController.getMonthlyTaxReport);
router.get("/bills/reports/tax/summary", billsController.getTaxSummary);
router.get("/bills/:id", billsController.getById);
router.put("/bills/:id", billsController.update);
router.post("/bills/:id/payment", billsController.addPayment);
router.get("/bills/:id/payments", billsController.getPaymentHistory);
router.delete("/bills/:id", billsController.cancel);

export default router;
