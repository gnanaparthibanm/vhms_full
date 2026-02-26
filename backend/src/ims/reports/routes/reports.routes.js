import express from "express";
import reportsController from "../controller/reports.controller.js";

const router = express.Router();

// Get report statistics (monthly & yearly breakdown)
router.get("/stats", reportsController.getReportStats);

// Get top customers
router.get("/top-customers", reportsController.getTopCustomers);

// Get item type breakdown (Medication, Product, Service)
router.get("/item-type-breakdown", reportsController.getItemTypeBreakdown);

// Get payment method breakdown
router.get("/payment-method-breakdown", reportsController.getPaymentMethodBreakdown);

// Get top selling items
router.get("/top-selling-items", reportsController.getTopSellingItems);

// Get sales trend (daily sales for a month)
router.get("/sales-trend", reportsController.getSalesTrend);

// Get dashboard summary
router.get("/dashboard-summary", reportsController.getDashboardSummary);

export default router;
