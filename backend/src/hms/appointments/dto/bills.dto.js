import { z } from "zod";

export const createBillSchema = z.object({
  bill_no: z.string().min(1, "Bill number is required"),
  appointment_id: z.string().uuid("Invalid appointment ID"),
  pet_id: z.string().uuid("Invalid pet ID"),
  client_id: z.string().uuid("Invalid client ID"),
  bill_date: z.string().optional(),
  discount: z.number().min(0).optional(),
  discount_percentage: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      item_type: z.enum(['Consultation', 'Medicine', 'Lab', 'Procedure', 'Vaccination', 'Treatment', 'Grooming', 'Other']),
      item_id: z.string().uuid().optional(),
      item_name: z.string().min(1, "Item name is required"),
      item_code: z.string().optional(),
      description: z.string().optional(),
      quantity: z.number().int().min(1).optional(),
      unit_price: z.number().min(0, "Unit price must be positive"),
      discount: z.number().min(0).optional(),
      tax_percentage: z.number().min(0).max(100).optional(),
      is_taxable: z.boolean().optional(), // Explicitly set if item is taxable
    })
  ).min(1, "At least one bill item is required"),
});

export const updateBillSchema = z.object({
  bill_date: z.string().optional(),
  discount: z.number().min(0).optional(),
  discount_percentage: z.number().min(0).max(100).optional(),
  status: z.enum(['Pending', 'Partially_Paid', 'Paid', 'Cancelled']).optional(),
  notes: z.string().optional(),
});

export const addPaymentSchema = z.object({
  payment_no: z.string().min(1, "Payment number is required"),
  payment_mode: z.enum(['Cash', 'UPI', 'Card', 'Net_Banking', 'Cheque', 'Other']),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  transaction_id: z.string().optional(),
  payment_reference: z.string().optional(),
  paid_at: z.string().optional(),
  notes: z.string().optional(),
});
