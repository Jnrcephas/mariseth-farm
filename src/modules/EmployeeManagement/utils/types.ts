import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { employeeProfileSchema } from "./validations";

export type FilterPropsEmployees = {
    page?: number;
    page_size?: number;
    query?: string;
    department?: string;
    archived?: boolean;
    job_title?: string;
  }

type FormValues = z.infer<typeof employeeProfileSchema>;

export type EmployeeFormProps = {
    form: UseFormReturn<FormValues>;
    onSubmit: (values: any) => void;
    isPending?: boolean;
    isUpdating?: boolean;
    isEdit?: boolean;
  }

