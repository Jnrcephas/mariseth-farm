"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE, routeTo} from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTrainingList } from "@/apis/adminApiComponents";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { formatDateReadable } from "@/lib/helpers";
import TrainingSearch from "./TrainingSearch";
import { FilterPropsTraining } from "./utils/types";
import { useRouter } from "next/navigation";
import RecordAttendanceModal from "./Modals/RecordAttendanceModal";
import { Badge } from "@/components/ui/badge";
import { statusBadgeMap } from "../FarmManagement/utils/constants";
import MarkAttendanceCompleteModal from "./Modals/MarkAttendanceCompleteModal";


export default function TrainingPastEvents({status}:{status: string}){
    const {hasAccess: mark_training_attendee_present} = useHasAccess("training|mark_training_attendee_present")
    const {hasAccess: view_training} = useHasAccess("training|view_training")
    const {hasAccess: set_attendee_status} = useHasAccess("training|set_attendee_status")

    const router = useRouter()
    const [selected, setSelected] = useState<any>({})
    const [attendanceModal, setAttendanceModal] = useState(false)
    const [completeModal, setCompleteModal] = useState(false)
    const [filters, setFilters] = useState<FilterPropsTraining>({
        page: 1, page_size: PAGE_SIZE, status: status
    })

    const {data: _data, isLoading, refetch} = useTrainingList({queryParams:filters})
    const data = _data as any

    function handleAttendanceModal(data: any){
        setSelected(data)
        setAttendanceModal(true)
    }
    function handleCompleteModal(data: any){
        setSelected(data)
        setCompleteModal(true)
    }

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }

    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }

    
    const columns: ColumnDef<any>[] = [
        { header: "Training ID", accessorKey: "training_id"},
        { header: "Title", accessorKey: "title"},
        { header: "Training Type", accessorKey: "training_type",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{row?.training_type}</div>
                )
            }
        },
        { header: "Training Mode", accessorKey: "training_mode",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{row?.training_mode}</div>
                )
            }
        },
        { header: "Start", accessorKey: "start_date",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{formatDateReadable(row?.start_date)}</div>
                )
            }
        },
        { header: "End", accessorKey: "end_date",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{formatDateReadable(row?.end_date)}</div>
                )
            }
        },
        { header: "Participants", accessorKey: "participants",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{row?.participants}</div>
                )
            }
        },
        { header: "Attendance Status", accessorKey: "attendance_status",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div><Badge className="capitalize" variant={statusBadgeMap[row?.attendance_status]}>{row?.attendance_status}</Badge></div>
                )
            }
        },
        { header: "Action", accessorKey: "action",
            cell: (_row) => {
                const row = _row?.row?.original
                return (
                  <div className="">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer">
                            <EllipsisVertical className="text-[#4A8D34]"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {view_training && 
                                <DropdownMenuItem className=" cursor-pointer" onClick={() => router.push(`${routeTo.trainingView}/${row?.id}`)}>View </DropdownMenuItem>
                            }  
                            <div>
                                {mark_training_attendee_present && (row?.attendance_status === "ongoing") && 
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleAttendanceModal(row)}>Take Attendance </DropdownMenuItem>
                                }
                            </div>
                            <div>
                                {set_attendee_status && (row?.attendance_status === "ongoing") &&
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleCompleteModal(row)}>Complete Attendance </DropdownMenuItem>
                                }
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
            },
        },
    ];
    return(
        <div className="mt-3">
           
            <div >
            <CustomTable 
                searchFilter={<TrainingSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
                columns={columns} 
                data={data?.results || []} 
                setPerPage={handleSetPageSize} 
                perPage={filters.page_size || PAGE_SIZE} 
                isLoading={isLoading}
                currentPage={filters?.page}
                count={data?.pagination?.total || 0}
                handlePaginationChange={handlePaginationChange}
                pagination={data?.pagination as IPagination}
            />
        
            {attendanceModal && 
                <RecordAttendanceModal
                    open={attendanceModal} 
                    setOpen={setAttendanceModal}
                    data={selected}
                    refetch={refetch}
                />
            }

            {completeModal && 
                <MarkAttendanceCompleteModal
                    open={completeModal} 
                    setOpen={setCompleteModal}
                    data={selected}
                    refetch={refetch}
                />
            }
           
            </div>
       
        </div>
    )
}