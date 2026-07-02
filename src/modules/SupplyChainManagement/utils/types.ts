export type FilterPropsWarehouse = {
    page?: number;
    page_size?: number;
    query?: string;
    crop?: string;
    region?: string;
    district?: string;
  }

export type FilterPropsCredit = {
    page?: number;
    page_size?: number;
    query?: string;
}

export type FilterPropsPayback = {
    page?: number;
    page_size?: number;
    query?: string;
}

export type FilterPropsInflow = {
    page?: number;
    page_size?: number;
    query?: string;
    completed?: boolean;
}

export type TProductDelivery = {
        id: number;
        driver_name: string;
        driver_phone_number: string;
        driver_license_number: string;
        truck_license_number: string;
        destination: string;
        company: string;
        escort_required: boolean;
        escort_details: string;
        warehouse_ids: any[];
        images: any[];
    };

    export type FilterPropsCustomers = {
    page?: number;
    page_size?: number;
    query?: string;
    crop?: string;
    region?: string;
    district?: string;
  }