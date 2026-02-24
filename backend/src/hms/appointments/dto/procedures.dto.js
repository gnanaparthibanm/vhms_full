import { z } from "zod";

export const createProcedureSchema = z.object({
  pet_id: z.string().uuid("Invalid pet ID"),
  appointment_id: z.string().uuid("Invalid appointment ID"),
  diagnosis_id: z.string().uuid("Invalid diagnosis ID").optional(),
  procedure_name: z.string().min(1, "Procedure name is required"),
  procedure_code: z.string().optional(),
  description: z.string().optional(),
  scheduled_date: z.string().optional(),
  performed_date: z.string().optional(),
  doctor_id: z.string().uuid("Invalid doctor ID").optional(),
  status: z.enum(['Scheduled', 'In_Progress', 'Completed', 'Cancelled']).optional(),
  cost: z.number().min(0).optional(),
  duration_minutes: z.number().int().min(0).optional(),
  notes: z.string().optional(),
  complications: z.string().optional(),
});

export const updateProcedureSchema = z.object({
  procedure_name: z.string().min(1).optional(),
  procedure_code: z.string().optional(),
  description: z.string().optional(),
  scheduled_date: z.string().optional(),
  performed_date: z.string().optional(),
  doctor_id: z.string().uuid("Invalid doctor ID").optional(),
  status: z.enum(['Scheduled', 'In_Progress', 'Completed', 'Cancelled']).optional(),
  cost: z.number().min(0).optional(),
  duration_minutes: z.number().int().min(0).optional(),
  notes: z.string().optional(),
  complications: z.string().optional(),
});
