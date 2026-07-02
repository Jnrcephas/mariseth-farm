import { TModal } from "@/modules/FarmManagement/utils/types";

export type FilterProps = {
    page?: number;
    page_size?: number;
    query?: string;
  }

export interface TCategoryModal extends TModal {
    refetch: () => void
}

export type TCategories = "product_crop_category" | "other_product_category" | "input_credits_category" |
    "product_livestock_category" | "job_title_level" | "farm_types" |
    "size_metric" | "weight_metric" | "quantity_metric" | "order_comment_reason" | "leave_type"