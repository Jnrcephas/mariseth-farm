"use client"
import { IPagination } from "@/components/CustomTable"
import CustomTable from "@/components/CustomTable";
import { TextLabel } from "@/components/ui/label";
import AttendanceSearch from "./Modals/AttendanceSearch";
import { Badge } from "@/components/ui/badge";
import { statusBadgeMap } from "../FarmManagement/utils/constants";
import { ColumnDef } from "@tanstack/react-table";
import { FilterPropsAttendance } from "./utils/types";
import { PAGE_SIZE } from "@/lib/constants";
import { useTrainingListAttendees } from "@/apis/adminApiComponents";
import { useState } from "react";
import Link from "next/link";
import { formatDateReadable } from "@/lib/helpers";

export default function ViewTraining({defaultData}:{defaultData: any}){

    const [filters, setFilters] = useState<FilterPropsAttendance>({
        page: 1, page_size: PAGE_SIZE, 
    })
    
    const {data:_attendees, isLoading, refetch} = useTrainingListAttendees({
        pathParams: {
            id: defaultData?.id
        }, queryParams:filters
    },{enabled: !!defaultData?.id})  

    const attendees = _attendees as any

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }

    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }

    const columns: ColumnDef<any>[] = [
            
            { header: "Name", accessorKey: "name",
                cell: (_row) => {
                    const row = _row?.row?.original
                    return(
                        <div className="capitalize">{row?.employee?.first_name} {row?.employee?.last_name}</div>
                    )
                }
            },
            { header: "Status", accessorKey: "status",
                cell: (_row) => {
                    const row = _row?.row?.original
                    return(
                        <div><Badge className="capitalize" variant={statusBadgeMap[row?.status]}>{row?.status}</Badge></div>
                    )
                }
            }
        ];
    return(
        <div className="">
            <div className="grid grid-cols-1 gap-5">
                <TextLabel title={"Training Title"} subTitle={defaultData?.title} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextLabel title={"Training Type"} subTitle={defaultData?.training_type} />
                    <TextLabel title={"Training Mode"} subTitle={defaultData?.training_mode} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextLabel title={"Description"} subTitle={defaultData?.description} />
                    <TextLabel title={"Location/Meeting Link"} subTitle={defaultData?.location} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextLabel title={"Start Date"} subTitle={formatDateReadable(defaultData?.start_date)} />
                    <TextLabel title={"End Date"} subTitle={formatDateReadable(defaultData?.end_date)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextLabel title={"Participants"} subTitle={defaultData?.participants} />
                    <TextLabel title={"Material Url"} subTitle={<Link className="underline text-blue-600" href={defaultData?.material_url || ""} target={"_blank"}>{defaultData?.material_url}</Link>} />
                </div>
            </div>
            <hr className="mb-5 mt-5"/>
            <div>
                <div>Attendees</div>
                <CustomTable
                    searchFilter={<AttendanceSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
                    columns={columns} 
                    data={attendees?.results || []} 
                    setPerPage={handleSetPageSize} 
                    perPage={filters.page_size || PAGE_SIZE} 
                    isLoading={isLoading}
                    currentPage={filters?.page}
                    count={attendees?.pagination?.total || 0}
                    handlePaginationChange={handlePaginationChange}
                    pagination={attendees?.pagination as IPagination}
                />
            </div>

        </div>
    )
}