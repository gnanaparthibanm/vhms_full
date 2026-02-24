import { z } from "zod";

export const createTreatmentSchema = z.object({
  pet_id: z.string().uuid("Invalid pet ID"),
  appointment_id: z.string().uuid("Invalid appointment ID"),
  diagnosis_id: z.string().uuid("Invalid diagnosis ID").optional(),
  treatment_name: z.string().min(1, "Treatment name is required"),
  treatment_type: z.enum(['Medication', 'Therapy', 'Surgery', 'Procedure', 'Other']),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(['Planned', 'In_Progress', 'Completed', 'Cancelled']).optional(),
  cost: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const updateTreatmentSchema = z.object({
  treatment_name: z.string().min(1).optional(),
  treatment_type: z.enum(['Medication', 'Therapy', 'Surgery', 'Procedure', 'Other']).optional(),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(['Planned', 'In_Progress', 'Completed', 'Cancelled']).optional(),
  cost: z.number().min(0).optional(),
  notes: z.string().optional(),
});
