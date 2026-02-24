import { z } from "zod";

/**
 * ✅ Create Pet Vitals Schema
 */
export const createPetVitalsSchema = z.object({
  addmission_id: z
    .string({ required_error: "Admission ID is required" })
    .uuid("Invalid UUID format"),

  weight: z
    .number()
    .positive("Weight must be a positive number")
    .optional(),

  temperature: z
    .number()
    .min(30, "Temperature seems too low")
    .max(45, "Temperature seems too high")
    .optional(),

  pulse_rate: z
    .number()
    .int("Pulse rate must be an integer")
    .positive("Pulse rate must be positive")
    .optional(),

  respiration_rate: z
    .number()
    .int("Respiration rate must be an integer")
    .positive("Respiration rate must be positive")
    .optional(),

  notes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional(),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

/**
 * ✅ Update Pet Vitals Schema
 */
export const updatePetVitalsSchema = z.object({
  weight: z
    .number()
    .positive("Weight must be a positive number")
    .optional(),

  temperature: z
    .number()
    .min(30, "Temperature seems too low")
    .max(45, "Temperature seems too high")
    .optional(),

  pulse_rate: z
    .number()
    .int("Pulse rate must be an integer")
    .positive("Pulse rate must be positive")
    .optional(),

  respiration_rate: z
    .number()
    .int("Respiration rate must be an integer")
    .positive("Respiration rate must be positive")
    .optional(),

  notes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional(),

  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
