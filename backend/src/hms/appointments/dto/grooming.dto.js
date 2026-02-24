import { z } from "zod";

export const createGroomingSchema = z.object({
  appointment_id: z.string().uuid("Invalid appointment ID"),
  pet_id: z.string().uuid("Invalid pet ID"),
  groomer_id: z.string().uuid("Invalid groomer ID").optional(),
  grooming_no: z.string().min(1, "Grooming number is required"),
  special_instructions: z.string().optional(),
  pet_behavior: z.enum(['Calm', 'Anxious', 'Aggressive', 'Cooperative']).optional(),
  recommended_by_doctor: z.boolean().optional(),
  consultation_id: z.string().uuid("Invalid consultation ID").optional(),
  services: z.array(
    z.object({
      service_type: z.enum([
        'Bath', 
        'Haircut', 
        'Nail_Trimming', 
        'Ear_Cleaning', 
        'Teeth_Brushing', 
        'Anal_Gland_Expression',
        'Flea_Treatment',
        'De_Shedding',
        'Full_Grooming_Package',
        'Other'
      ]),
      service_name: z.string().min(1, "Service name is required"),
      description: z.string().optional(),
      cost: z.number().min(0),
      duration_minutes: z.number().int().min(0).optional(),
      notes: z.string().optional(),
    })
  ).min(1, "At least one service is required"),
});

export const updateGroomingSchema = z.object({
  groomer_id: z.string().uuid("Invalid groomer ID").optional(),
  status: z.enum(['Scheduled', 'In_Progress', 'Completed', 'Cancelled']).optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  special_instructions: z.string().optional(),
  pet_behavior: z.enum(['Calm', 'Anxious', 'Aggressive', 'Cooperative']).optional(),
  health_concerns: z.string().optional(),
  before_photos: z.array(z.string()).optional(),
  after_photos: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const recommendGroomingSchema = z.object({
  pet_id: z.string().uuid("Invalid pet ID"),
  consultation_appointment_id: z.string().uuid("Invalid consultation appointment ID"),
  recommended_services: z.array(z.string()).min(1, "At least one service must be recommended"),
  special_instructions: z.string().optional(),
  reason: z.string().optional(),
});

export const createGroomingPackageSchema = z.object({
  package_name: z.string().min(1, "Package name is required"),
  package_code: z.string().min(1, "Package code is required"),
  description: z.string().optional(),
  pet_size: z.enum(['Small', 'Medium', 'Large', 'Extra_Large', 'All']),
  services_included: z.array(z.string()).min(1, "At least one service must be included"),
  base_price: z.number().min(0, "Base price must be positive"),
  estimated_duration: z.number().int().min(0).optional(),
});

export const updateGroomingPackageSchema = z.object({
  package_name: z.string().min(1).optional(),
  description: z.string().optional(),
  pet_size: z.enum(['Small', 'Medium', 'Large', 'Extra_Large', 'All']).optional(),
  services_included: z.array(z.string()).optional(),
  base_price: z.number().min(0).optional(),
  estimated_duration: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});
