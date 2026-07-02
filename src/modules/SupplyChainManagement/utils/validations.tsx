import { z } from "zod";

export const warehouseSchema = z.object({
  name: z.string().min(2, {
    message: 'Warehouse name must be at least 2 characters.',
  }),
  region: z.string(),
  district: z.string(),
  capacity: z.string(),
  managers: z.array(z.object({
    value: z.number(),
    label: z.string()
  })),
});


export const creditSchema = z.object({
  farmer: z.string(),
  input_credits: z.string(),
  type: z.string(),
  quantity: z.string(),
  credit_amount: z.string(),
  issue_date: z.string(),
  due_date: z.string(),
  interest_rate: z.string(),
  notes: z.string().optional(),
});

export const paybackSchema = z.object({
  payback_method: z.string(),
  amount: z.string(),
  product: z.string().optional(),
  quantity_bags: z.string().optional(),
  comments: z.string().optional(),
});

export const warehouseSearchSchema = z.object({
  query: z.string().optional(),
  region: z.string().optional(),
  district: z.string().optional()
});

export const inflowSchema = z.object({
  aggregator: z.string(),
  procurement_officer: z.string(),
  destination_warehouse: z.string(),
  expected_delivery_date: z.string(),
  comments: z.string().optional(),
  additional_costs: z.string().optional(),
  additional_cost_amount: z.string().optional(),
});

export const outflowSchema = z.object({
  customer: z.string(),
  procurement_officer: z.string(),
  destination: z.string(),
  expected_delivery_date: z.string(),
  extra_comments: z.string().optional(),
  additional_costs: z.string().optional(),
  additional_cost_amount: z.string().optional(),
});

export const creditSearchSchema = z.object({
  query: z.string().optional(),
  type: z.string().optional(),
  payment_status: z.string().optional(),
  status: z.string().optional(),
  payback_method: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
});

export const inflowSearchSchema = z.object({
  query: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
});

export const inflowInspectionSchema = z.object({
  notes: z.string().optional(),
});

export const paymentSchema = z.object({
  amount_paid: z.string(),
  payment_type: z.string(),
  payment_method: z.string(),
  mobile_money_number: z.string().optional(),
  paid_to: z.string().optional(),
  notes: z.string().optional(),
  bank_name: z.string().optional(),
  bank_account_number: z.string().optional(),
  bank_account_name: z.string().optional(),
});