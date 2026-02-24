import { z } from "zod";

export const createVaccinationSchema = z.object({
  pet_id: z.string().uuid("Invalid pet ID"),
  appointment_id: z.string().uuid("Invalid appointment ID").optional(),
  vaccine_name: z.string().min(1, "Vaccine name is required"),
  vaccine_code: z.string().optional(),
  manufacturer: z.string().optional(),
  batch_number: z.string().optional(),
  date_given: z.string().optional(),
  next_due_date: z.string().optional(),
  doctor_id: z.string().uuid("Invalid doctor ID").optional(),
  cost: z.number().min(0).optional(),
  site_of_injection: z.string().optional(),
  adverse_reactions: z.string().optional(),
  notes: z.string().optional(),
});

export const updateVaccinationSchema = z.object({
  vaccine_name: z.string().min(1).optional(),
  vaccine_code: z.string().optional(),
  manufacturer: z.string().optional(),
  batch_number: z.string().optional(),
  date_given: z.string().optional(),
  next_due_date: z.string().optional(),
  doctor_id: z.string().uuid("Invalid doctor ID").optional(),
  cost: z.number().min(0).optional(),
  site_of_injection: z.string().optional(),
  adverse_reactions: z.string().optional(),
  notes: z.string().optional(),
});
