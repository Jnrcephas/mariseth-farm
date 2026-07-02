"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE, routeTo} from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTrainingList } from "@/apis/adminApiComponents";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { Badge } from "@/components/ui/badge";
import { formatDateReadable } from "@/lib/helpers";
import { statusBadgeMap } from "../FarmManagement/utils/constants";
import DeleteTrainingModal from "./Modals/DeleteTrainingModal";
import TrainingSearch from "./TrainingSearch";
import { FilterPropsTraining } from "./utils/types";
import { useRouter } from "next/navigation";


export default function TrainingUpcomingEvents({status}:{status: string}){
    const {hasAccess: update_training} = useHasAccess("training|update_training")
    const {hasAccess: delete_training} = useHasAccess("training|delete_training")
    const {hasAccess: view_training} = useHasAccess("training|view_training")

    const router = useRouter()
    const [selected, setSelected] = useState<any>({})
    const [deleteModal, setDeleteModal] = useState(false)
    const [filters, setFilters] = useState<FilterPropsTraining>({
        page: 1, page_size: PAGE_SIZE, status: status
    })

    const {data: _data, isLoading, refetch} = useTrainingList({queryParams:filters})
    const data = _data as any

    function handleDeleteModal(data: any){
        setSelected(data)
        setDeleteModal(true)
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
                    <div className="capitalize">{row?.training_mode === "online" ? "Virtual" : "In-Person"}</div>
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
                    <div className="capitalize">{row?.participants?.split("/")?.[1]}</div>
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
                            {(row?.status !== "approved") &&
                                <div>
                                    {update_training && 
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`${routeTo.trainingEdit}/${row?.id}`)}>Edit </DropdownMenuItem>
                                    }
                                    {delete_training && 
                                        <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => handleDeleteModal(row)}>Delete </DropdownMenuItem>
                                    } 
                                </div>
                            }
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
        
            {deleteModal && 
                <DeleteTrainingModal
                    open={deleteModal} 
                    setOpen={setDeleteModal}
                    data={selected}
                    refetch={refetch}
                />
            }
           
            </div>
       
        </div>
    )
}