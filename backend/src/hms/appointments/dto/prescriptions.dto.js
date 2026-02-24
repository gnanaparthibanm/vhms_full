import { z } from "zod";

export const createPrescriptionSchema = z.object({
  pet_id: z.string().uuid("Invalid pet ID"),
  diagnosis_id: z.string().uuid("Invalid diagnosis ID").optional(),
  appointment_id: z.string().uuid("Invalid appointment ID").optional(),
  prescription_no: z.string().min(1, "Prescription number is required"),
  prescription_date: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['Pending', 'Dispensed', 'Partially_Dispensed', 'Cancelled']).optional(),
  items: z.array(
    z.object({
      product_id: z.string().uuid("Invalid product ID"),
      quantity: z.number().int().min(1, "Quantity must be at least 1"),
      dosage: z.string().optional(),
      frequency: z.string().optional(),
      duration: z.string().optional(),
      instructions: z.string().optional(),
    })
  ).min(1, "At least one prescription item is required"),
});

export const updatePrescriptionSchema = z.object({
  prescription_date: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['Pending', 'Dispensed', 'Partially_Dispensed', 'Cancelled']).optional(),
});

export const updatePrescriptionItemSchema = z.object({
  quantity: z.number().int().min(1).optional(),
  dispensed_quantity: z.number().int().min(0).optional(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  instructions: z.string().optional(),
});

export const dispensePrescriptionSchema = z.object({
  items: z.array(
    z.object({
      prescription_item_id: z.string().uuid("Invalid prescription item ID"),
      dispensed_quantity: z.number().int().min(1, "Dispensed quantity must be at least 1"),
    })
  ).min(1, "At least one item to dispense is required"),
});
