import express from "express";
import diagnosisController from "../controller/diagnosis.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createDiagnosisSchema,
  updateDiagnosisSchema,
} from "../dto/diagnosis.dto.js";

const router = express.Router();

/**
 * ✅ Create Diagnosis
 * Roles allowed: Doctor, Nurse, Admin, Super Admin
 */
router.post(
  "/diagnosis",
  verifyToken(["Doctor", "Nurse", "Admin", "Super Admin"]),
  validate(createDiagnosisSchema),
  diagnosisController.create
);

/**
 * ✅ Get All Diagnosis
 * Roles allowed: All authenticated users
 */
router.get(
  "/diagnosis",
  verifyToken(),
  diagnosisController.getAll
);

/**
 * ✅ Get Diagnosis by ID
 * Roles allowed: All authenticated users
 */
router.get(
  "/diagnosis/:id",
  verifyToken(),
  diagnosisController.getById
);

/**
 * ✅ Get Latest Diagnosis by Admission ID
 * Roles allowed: Doctor, Nurse, Admin, Super Admin
 */
router.get(
  "/diagnosis/admission/:admission_id/latest",
  verifyToken(["Doctor", "Nurse", "Admin", "Super Admin"]),
  diagnosisController.getLatestByAdmission
);

/**
 * ✅ Update Diagnosis
 * Roles allowed: Doctor, Nurse, Admin, Super Admin
 */
router.put(
  "/diagnosis/:id",
  verifyToken(["Doctor", "Nurse", "Admin", "Super Admin"]),
  validate(updateDiagnosisSchema),
  diagnosisController.update
);

/**
 * ✅ Soft Delete Diagnosis
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/diagnosis/:id",
  verifyToken(["Admin", "Super Admin"]),
  diagnosisController.delete
);

/**
 * ✅ Restore Diagnosis
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/diagnosis/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  diagnosisController.restore
);

export default router;