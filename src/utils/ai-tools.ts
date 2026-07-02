
import {
    fetchFarmManagementFarmList,
    fetchFarmManagementFarmerList,
    fetchFarmManagementProductList,
} from "@/apis/adminApiComponents";

export const tools = [
    {
        name: "list_farms",
        description: "List and filter farms in the organization.",
        parameters: {
            type: "OBJECT",
            properties: {
                query: {
                    type: "STRING",
                    description: "Search by farm name or ID",
                },
                farm_type: {
                    type: "STRING",
                    description: "Filter by farm type",
                },
                farm_size: {
                    type: "STRING",
                    description: "Filter by farm size",
                },
                crop_type: {
                    type: "STRING",
                    description: "Filter by primary crop",
                },
            },
        },
    },
    {
        name: "list_farmers",
        description: "List and filter farmers in the organization.",
        parameters: {
            type: "OBJECT",
            properties: {
                query: {
                    type: "STRING",
                    description: "Search by name, phone, email, farm name or farmer_id",
                },
                farmer_type: {
                    type: "STRING",
                    description: "Filter by farmer type",
                },
                country: {
                    type: "STRING",
                    description: "Filter by country code",
                },
            },
        },
    },
    {
        name: "list_products",
        description: "List and filter products (crops, livestock, etc).",
        parameters: {
            type: "OBJECT",
            properties: {
                query: {
                    type: "STRING",
                    description: "Search by name or product_id",
                },
                type: {
                    type: "STRING",
                    description: "Filter by product type (e.g., 'crops', 'livestock')",
                },
            },
        },
    },
];

export const functions: Record<string, (args: any, config?: any) => Promise<any>> = {
    list_farms: async (args: any, config: any = {}) => {
        return await fetchFarmManagementFarmList({ ...config, queryParams: args });
    },
    list_farmers: async (args: any, config: any = {}) => {
        return await fetchFarmManagementFarmerList({ ...config, queryParams: args });
    },
    list_products: async (args: any, config: any = {}) => {
        return await fetchFarmManagementProductList({ ...config, queryParams: args });
    },
};
