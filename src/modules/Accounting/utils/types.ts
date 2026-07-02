import { Customer } from "@/apis/adminApiSchemas";
import { TModal } from "@/modules/FarmManagement/utils/types";

export type FilterPropsWaybill = {
    page?: number;
    page_size?: number;
    query?: string;
    order_type?: "inflow" | "outflow"
  }

export type FilterPropsExpenses = {
    page?: number;
    page_size?: number;
    query?: string;
  }

export interface TCustomer extends TModal{
  defaultData?: Customer
}

export type FilterPropsInvoice = {
    page?: number;
    page_size?: number;
    query?: string;
  }
  