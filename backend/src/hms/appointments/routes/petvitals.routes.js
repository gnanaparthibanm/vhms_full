import express from "express";
import petVitalsController from "../controller/petvitals.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createPetVitalsSchema,
  updatePetVitalsSchema,
} from "../dto/petvitals.dto.js";

const router = express.Router();

/**
 * ✅ Create Pet Vitals
 * Roles allowed: Doctor, Nurse, Admin, Super Admin
 */
router.post(
  "/petvitals",
  verifyToken(["Doctor", "Nurse", "Admin", "Super Admin"]),
  validate(createPetVitalsSchema),
  petVitalsController.create
);

/**
 * ✅ Get All Pet Vitals
 * Roles allowed: All authenticated users
 */
router.get(
  "/petvitals",
  verifyToken(),
  petVitalsController.getAll
);

/**
 * ✅ Get Pet Vitals by ID
 * Roles allowed: All authenticated users
 */
router.get(
  "/petvitals/:id",
  verifyToken(),
  petVitalsController.getById
);

/**
 * ✅ Get Latest Pet Vitals by Admission ID
 * Roles allowed: Doctor, Nurse, Admin
 */
router.get(
  "/petvitals/admission/:admission_id/latest",
  verifyToken(["Doctor", "Nurse", "Admin", "Super Admin"]),
  petVitalsController.getLatestByAdmission
);

/**
 * ✅ Update Pet Vitals
 * Roles allowed: Doctor, Nurse, Admin
 */
router.put(
  "/petvitals/:id",
  verifyToken(["Doctor", "Nurse", "Admin", "Super Admin"]),
  validate(updatePetVitalsSchema),
  petVitalsController.update
);

/**
 * ✅ Soft Delete Pet Vitals
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/petvitals/:id",
  verifyToken(["Admin", "Super Admin"]),
  petVitalsController.delete
);

/**
 * ✅ Restore Pet Vitals
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/petvitals/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  petVitalsController.restore
);

export default router;
