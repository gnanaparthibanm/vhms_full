import { z } from "zod";

/**
 * ✅ Create Pet Clinical Notes Schema
 */
export const createPetClinicalNotesSchema = z.object({
  addmission_id: z
    .string({ required_error: "Admission ID is required" })
    .uuid("Invalid UUID format"),

  symptoms: z
    .string()
    .max(2000, "Symptoms cannot exceed 2000 characters")
    .optional(),

  observations: z
    .string()
    .max(2000, "Observations cannot exceed 2000 characters")
    .optional(),

  notes: z
    .string()
    .max(3000, "Notes cannot exceed 3000 characters")
    .optional(),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

/**
 * ✅ Update Pet Clinical Notes Schema
 */
export const updatePetClinicalNotesSchema = z.object({
  symptoms: z
    .string()
    .max(2000, "Symptoms cannot exceed 2000 characters")
    .optional(),

  observations: z
    .string()
    .max(2000, "Observations cannot exceed 2000 characters")
    .optional(),

  notes: z
    .string()
    .max(3000, "Notes cannot exceed 3000 characters")
    .optional(),

  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
