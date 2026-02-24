import { z } from "zod";

export const createFollowUpSchema = z.object({
  appointment_id: z.string().uuid("Invalid appointment ID"),
  diagnosis_id: z.string().uuid("Invalid diagnosis ID").optional(),
  next_visit_date: z.string().min(1, "Next visit date is required"),
  reason: z.string().optional(),
  instructions: z.string().optional(),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled', 'Missed']).optional(),
});

export const updateFollowUpSchema = z.object({
  next_visit_date: z.string().optional(),
  reason: z.string().optional(),
  instructions: z.string().optional(),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled', 'Missed']).optional(),
  reminder_sent: z.boolean().optional(),
});
