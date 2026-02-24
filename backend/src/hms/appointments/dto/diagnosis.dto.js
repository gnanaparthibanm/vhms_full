import { z } from "zod";

// Allowed ENUM values
const severityEnum = ["Mild", "Moderate", "Severe"];

/**
 * ✅ Create Diagnosis Schema
 */
export const createDiagnosisSchema = z.object({
  addmission_id: z
    .string({ required_error: "Admission ID is required" })
    .uuid("Invalid UUID format"),

  diagnosis_name: z
    .string({ required_error: "Diagnosis name is required" })
    .min(2, "Diagnosis name must be at least 2 characters")
    .max(255, "Diagnosis name cannot exceed 255 characters"),

  severity: z.enum(severityEnum, {
    required_error: "Severity is required",
  }),

  remarks: z
    .string()
    .max(3000, "Remarks cannot exceed 3000 characters")
    .optional(),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

/**
 * ✅ Update Diagnosis Schema
 */
export const updateDiagnosisSchema = z.object({
  diagnosis_name: z
    .string()
    .min(2, "Diagnosis name must be at least 2 characters")
    .max(255, "Diagnosis name cannot exceed 255 characters")
    .optional(),

  severity: z.enum(severityEnum).optional(),

  remarks: z
    .string()
    .max(3000, "Remarks cannot exceed 3000 characters")
    .optional(),

  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});