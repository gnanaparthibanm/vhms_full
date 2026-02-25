import express from "express";
import settingsController from "../controller/settings.controller.js";
import { verifyToken } from "../../../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken());

// ============ TAX RATES ============
router.post("/tax-rates", settingsController.createTaxRate);
router.get("/tax-rates", settingsController.getAllTaxRates);
router.get("/tax-rates/:id", settingsController.getTaxRateById);
router.put("/tax-rates/:id", settingsController.updateTaxRate);
router.delete("/tax-rates/:id", settingsController.deleteTaxRate);

// ============ DISCOUNTS ============
router.post("/discounts", settingsController.createDiscount);
router.get("/discounts", settingsController.getAllDiscounts);
router.get("/discounts/:id", settingsController.getDiscountById);
router.put("/discounts/:id", settingsController.updateDiscount);
router.delete("/discounts/:id", settingsController.deleteDiscount);

// ============ PAYMENT METHODS ============
router.post("/payment-methods", settingsController.createPaymentMethod);
router.get("/payment-methods", settingsController.getAllPaymentMethods);
router.get("/payment-methods/:id", settingsController.getPaymentMethodById);
router.put("/payment-methods/:id", settingsController.updatePaymentMethod);
router.delete("/payment-methods/:id", settingsController.deletePaymentMethod);

// ============ CATEGORIES ============
router.post("/categories", settingsController.createCategory);
router.get("/categories", settingsController.getAllCategories);
router.get("/categories/:id", settingsController.getCategoryById);
router.put("/categories/:id", settingsController.updateCategory);
router.delete("/categories/:id", settingsController.deleteCategory);

export default router;
