import { z } from "zod";

export const searchEmployeeSchema = z.object({
  query: z.string().optional(),
  department: z.string().optional(),
  status: z.string().optional(),
});

export const departmentSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  status: z.string(),
});

export const departmentSearchSchema = z.object({
  query: z.string().optional(),
  status: z.string().optional(),
});

export const jobTitleSchema = z.object({
  name: z.string(),
  level: z.string(),
  department: z.string(),
  job_description_url: z.string().optional(),
});

export const employeeProfileSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  gender: z.string(),
  relationship_status: z.string().optional(),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  date_of_birth: z.string().optional(),
  ghana_card_number: z.string().optional(),
  notification: z.string()
});

export const qualificationSchema = z.object({
  title: z.string(),
});

export const employeeContractSchema = z.object({
  start_date: z.string(),
  job_title: z.string(),
  department: z.string(),
  employment_type: z.string(),
  work_type: z.string().optional(),
  annual_leave_days: z.string().optional(),
  sick_leave_days: z.string().optional(),
  leave_rollover: z.string().optional(),
  ssnit_number: z.string().optional(),
  bank_name: z.string().optional(),
  bank_branch: z.string().optional(),
  account_number: z.string().optional(),
});

export const employeeDisciplinarySchema = z.object({
  action_type: z.string(),
  offense: z.string().optional(),
});