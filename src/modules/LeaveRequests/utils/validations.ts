import { z } from "zod";

export const searchLeaveRequestsSchema = z.object({
  query: z.string().optional(),
  department: z.string().optional(),
  status: z.string().optional(),
  request_date_to: z.string().optional(),
  request_date_from: z.string().optional(),
  leave_type: z.string().optional(),
});

export const leaveRequestTypeSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  max_days: z.string().optional(),
  deducts_from_allowance: z.boolean(),
  deduct_from: z.string().optional(),
});

export const leaveRequestSchema = z.object({
  employee: z.string(),
  leave_type: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  reason: z.string()
});

export const denyRequestSchema = z.object({
  rejection_reason: z.string()
});

