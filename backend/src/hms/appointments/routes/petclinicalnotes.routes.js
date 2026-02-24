import express from "express";
import petClinicalNotesController from "../controller/petclinicalnotes.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import {
  createPetClinicalNotesSchema,
  updatePetClinicalNotesSchema,
} from "../dto/petclinicalnotes.dto.js";

const router = express.Router();

/**
 * ✅ Create Pet Clinical Notes
 * Roles allowed: Doctor, Nurse, Admin, Super Admin
 */
router.post(
  "/petclinicalnotes",
  verifyToken(["Doctor", "Nurse", "Admin", "Super Admin"]),
  validate(createPetClinicalNotesSchema),
  petClinicalNotesController.create
);

/**
 * ✅ Get All Pet Clinical Notes
 * Roles allowed: All authenticated users
 */
router.get(
  "/petclinicalnotes",
  verifyToken(),
  petClinicalNotesController.getAll
);

/**
 * ✅ Get Pet Clinical Notes by ID
 * Roles allowed: All authenticated users
 */
router.get(
  "/petclinicalnotes/:id",
  verifyToken(),
  petClinicalNotesController.getById
);

/**
 * ✅ Get Latest Pet Clinical Notes by Admission ID
 * Roles allowed: Doctor, Nurse, Admin, Super Admin
 */
router.get(
  "/petclinicalnotes/admission/:admission_id/latest",
  verifyToken(["Doctor", "Nurse", "Admin", "Super Admin"]),
  petClinicalNotesController.getLatestByAdmission
);

/**
 * ✅ Update Pet Clinical Notes
 * Roles allowed: Doctor, Nurse, Admin, Super Admin
 */
router.put(
  "/petclinicalnotes/:id",
  verifyToken(["Doctor", "Nurse", "Admin", "Super Admin"]),
  validate(updatePetClinicalNotesSchema),
  petClinicalNotesController.update
);

/**
 * ✅ Soft Delete Pet Clinical Notes
 * Roles allowed: Admin, Super Admin
 */
router.delete(
  "/petclinicalnotes/:id",
  verifyToken(["Admin", "Super Admin"]),
  petClinicalNotesController.delete
);

/**
 * ✅ Restore Pet Clinical Notes
 * Roles allowed: Admin, Super Admin
 */
router.patch(
  "/petclinicalnotes/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  petClinicalNotesController.restore
);

export default router;
