import { Farm, Farmer, Product } from "@/apis/adminApiSchemas";

export type FilterProps = {
    page?: number;
    page_size?: number;
    query?: string;
    farmer_type?: "lead" | "smallholder" | "commercial"
    order_type?: "inflow" | "outflow";
  }
export type FilterPropsProduct = {
    page?: number;
    page_size?: number;
    query?: string;
    type?: "crop" | "other"
  }

  export type FilterPropsFarms = {
    page?: number;
    page_size?: number;
    query?: string;
    farm_type?: "external" | "internal";
    export?: boolean;
  }

export type TFarmType = "external" | "mariseth"

export type TAddFarmModal = {
  open: boolean;
  setOpen: (open: boolean) => void
  defaultData?: any
  isEdit?: boolean
  refetch?: () => void;
}

export type TModal = {
  open: boolean;
  setOpen: (open: boolean) => void
  defaultData?: any
  isEdit?: boolean
  refetch?: () => void
}

export type TViewFarmModal = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any
}

export type TViewFlowModal = {
  open: boolean;
  setOpen: (open: boolean) => void
  defaultData?: any
  flow_type?: "Inflow" | "Outflow"
}

export interface IFarmer extends Omit<Farmer, "region" | "district" | "farm"> {
    /** Not in the generated API types yet; set by the farmer forms. */
    is_refugee?: boolean | null
    region: {
        name: string
        id: string
    },
    district: {
        name: string
        id: string
    }
    farm: Farm
}

export type IFarmInfo = Farm & Farmer["support_assistance"] & {
  size_metric: {
    name: string;
    id: string;
  },
  crops: Product[]
}