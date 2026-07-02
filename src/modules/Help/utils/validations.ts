import { z } from "zod";

export const helpSchema = z.object({
  title: z.string().min(2, {
    message: 'Farm name must be at least 2 characters.',
  }),
  url: z.string().url("Please enter a valid URL"),
  description: z.string().optional(),
});

export const helpSearchSchema = z.object({
  query: z.string().optional(),
});