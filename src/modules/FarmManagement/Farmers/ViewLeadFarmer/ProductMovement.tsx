import CustomTable from "@/components/CustomTable";
import { PAGE_SIZE} from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { FilterProps } from "../../utils/types";
import { samplePagination } from "../../utils/constants";

const sampleData = [
    {
        product_id: "C-110203",
        name: "Soya Beans",
        date: "March 12, 2024",
        weight: "140",
        quantity: "140",
        destination: "Tumu Warehouse 1",   
        amount: "140",          
    },
    {
        product_id: "C-110203",
        name: "Soya Beans",
        date: "March 12, 2024",
        weight: "140",
        quantity: "140",
        destination: "Tumu Warehouse 1",   
        amount: "140",          
    },
    {
        product_id: "C-110203",
        name: "Soya Beans",
        date: "March 12, 2024",
        weight: "140",
        quantity: "140",
        destination: "Tumu Warehouse 1",   
        amount: "140",          
    },
    {
        product_id: "C-110203",
        name: "Soya Beans",
        date: "March 12, 2024",
        weight: "140",
        quantity: "140",
        destination: "Tumu Warehouse 1",   
        amount: "140",          
    },
    {
        product_id: "C-110203",
        name: "Soya Beans",
        date: "March 12, 2024",
        weight: "140",
        quantity: "140",
        destination: "Tumu Warehouse 1",   
        amount: "140",          
    },
    {
        product_id: "C-110203",
        name: "Soya Beans",
        date: "March 12, 2024",
        weight: "140",
        quantity: "140",
        destination: "Tumu Warehouse 1",   
        amount: "140",          
    },
    {
        product_id: "C-110203",
        name: "Soya Beans",
        date: "March 12, 2024",
        weight: "140",
        quantity: "140",
        destination: "Tumu Warehouse 1",   
        amount: "140",          
    },
]

export default function ProductMovement(){

    const [perPage, setPerPage] = useState(PAGE_SIZE)
    const [filters, setFilters] = useState<FilterProps>({
        page: 1, page_size: perPage
    })

    const handlePaginationChange = (page: number) => {
        console.log("filters", filters)
        setFilters((prev) => ({ ...prev, page }))
    }

    const columns: ColumnDef<any>[] = [
        { header: "Product ID", accessorKey: "product_id" },
        { header: "Name", accessorKey: "name" },
        { header: "Date", accessorKey: "date" },
        { header: "Weight (kg)", accessorKey: "weight" },
        { header: "Quantity (weight)", accessorKey: "quantity" },
        { header: "Destination", accessorKey: "destination"},
        { header: "Amount (GH₵)", accessorKey: "amount"},
    ];
    return(
    <div className="">
        <CustomTable 
            columns={columns} 
            data={sampleData} 
            setPerPage={setPerPage} 
            perPage={perPage} 
            count={sampleData.length || 0}
            handlePaginationChange={handlePaginationChange}
            pagination={samplePagination}
        />
    </div>
    )
}