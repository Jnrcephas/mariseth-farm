import { z } from "zod";

export const trainingSearchSchema = z.object({
  query: z.string().optional(),
  status: z.string().optional(),
  training_type: z.string().optional(),
  training_mode: z.string().optional(),
  training_date_from: z.string().optional(),
  training_date_to: z.string().optional(),
});

export const attendanceSearchSchema = z.object({
  query: z.string().optional(),
});


export const trainingSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  training_type: z.string(),
  training_mode: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  location: z.string().optional(),
  attendees: z.string(),
  material_url: z.string().optional(),
  selected_employees: z.array(z.object({
    value: z.number(),
    label: z.string()
  })).optional(),
  departments: z.array(z.object({
    value: z.number(),
    label: z.string()
  })).optional()
});