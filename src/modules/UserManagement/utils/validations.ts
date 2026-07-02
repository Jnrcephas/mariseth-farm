import { z } from "zod";

export const searchUserSchema = z.object({
  query: z.string().optional(),
  status: z.string().optional(),
});

export const userSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  gender: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  group: z.string(),
});