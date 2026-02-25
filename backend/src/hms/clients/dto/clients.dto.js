import { z } from "zod";

// ✅ Create Client Schema
export const createClientSchema = z.object({
  first_name: z
    .string({ required_error: "First name is required" })
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name cannot exceed 100 characters"),

  last_name: z
    .string()
    .max(100, "Last name cannot exceed 100 characters")
    .optional(),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters"),

  phone: z
    .string()
    .max(15, "Phone number cannot exceed 15 digits")
    .optional(),

  alternate_phone: z
    .string()
    .max(15, "Alternate phone number cannot exceed 15 digits")
    .optional(),

  city: z
    .string()
    .max(100, "City cannot exceed 100 characters")
    .optional(),

  gender: z.enum(["Male", "Female"]).optional(),

  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }).optional(),

  age: z
    .number()
    .int("Age must be an integer")
    .positive("Age must be greater than 0").optional(),

  address: z
    .string()
    .max(255, "Address cannot exceed 255 characters")
    .optional(),

  blood_group: z.enum(
    ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
  ).optional(),

  marital_status: z.enum(["Single", "Married"]).optional(),

  notes: z.string().max(255).optional(),

  is_active: z.boolean().optional().default(true),

  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

// ✅ Update Client Schema
export const updateClientSchema = z.object({
  first_name: z.string().min(2).max(100).optional(),
  last_name: z.string().max(100).optional(),
  email: z.string().email().max(100).optional(),
  phone: z.string().max(15).optional(),
  alternate_phone: z.string().max(15).optional(),
  city: z.string().max(100).optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .optional(),
  age: z.number().int().positive().optional(),
  address: z.string().min(5).max(255).optional(),
  blood_group: z
    .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
    .optional(),
  marital_status: z.enum(["Single", "Married"]).optional(),
  notes: z.string().max(255).optional(),
  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
