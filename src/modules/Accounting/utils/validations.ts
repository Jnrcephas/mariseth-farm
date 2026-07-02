import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, {
    message: 'Warehouse name must be at least 2 characters.',
  }),
  phone_number: z.string().optional(),
  email: z.string().email().optional(),
  location: z.string().optional(),
  company: z.string().optional(),
  comments: z.string().optional(),
});

export const customerSearchSchema = z.object({
  query: z.string().optional(),
});