import { z } from "zod";

export const denyCreditSchema = z.object({
  denial_notes: z.string().optional(),
});

export const approveCreditSchema = z.object({
  credit_amount: z.string(),
  interest_rate: z.string(),
  issue_date: z.string(),
  due_date: z.string(),
  denial_notes: z.string().optional()
});