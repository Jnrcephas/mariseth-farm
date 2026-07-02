import { useTrainingListAttendees, useTrainingMarkAttendeesPresent } from "@/apis/adminApiComponents";
import CustomTable, { IPagination } from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { TextLabel } from "@/components/ui/label";
import { PAGE_SIZE } from "@/lib/constants";
import { commaSeparator, getErrorMap } from "@/lib/helpers";
import { Check, Loader, X, XCircle } from "lucide-react"
import { toast } from "sonner";
import { FilterPropsAttendance } from "../utils/types";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import AttendanceSearch from "./AttendanceSearch";

export default function RecordAttendanceModal({
    open, 
    setOpen, 
    data,
    refetch}:{
        open: boolean, 
        setOpen: (open: boolean) => void, 
        data: any;
        refetch: () => void;
    }) {

    const [filters, setFilters] = useState<FilterPropsAttendance>({
        page: 1, page_size: PAGE_SIZE, 
    })

    const [selectedEmpId, setSelectedEmpId] = useState(false)

    const {data:_attendees, isLoading, refetch: refetchAttendees} = useTrainingListAttendees({
        pathParams: {
            id: data?.id
        }, queryParams:filters
    },{enabled: !!data?.id})  

    const attendees = _attendees as any

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }

    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }

    const {mutate: mutateMarkPresent, isPending} = useTrainingMarkAttendeesPresent({
        onSuccess: () =>{
            refetch()
            refetchAttendees()
            toast.success("Attendance Recorded Successfully")
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })
   
    const handleMarkEmployeePresent = (values: any,  action: string) => {
        const empId = values?.employee?.id
        setSelectedEmpId(empId)
        mutateMarkPresent({
            pathParams: {
                id: data?.id,
            },
            body: {
                action: action,
                employees: [empId]
            }
        } as any)
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
            },
            { header: "Action", accessorKey: "action",
                cell: (_row) => {
                    const row = _row?.row?.original
                    return (
                      <div className="">
                        {/* {row?.status === "present" ?
                            <XCircle className="text-white bg-red-500">Absent</XCircle>:
                            <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center cursor-pointer">
                                <Check size={15} className="text-white">Present</Check>
                            </div>
                        } */}
                        {row?.status === "present" ?
                            <Button onClick={() => handleMarkEmployeePresent(row, "absent")} size={"sm"} className="h-6 text-white bg-red-600 hover:bg-red-600 text-xs font-bold">
                                {(selectedEmpId === row?.employee?.id) && isPending ? <Loader className="animate-spin text-white"/>:<X />}
                                Mark Absent
                            </Button>:
                            <Button onClick={() => handleMarkEmployeePresent(row, "present")} size={"sm"} className="h-6 text-white bg-green-600 text-xs font-bold"> 
                                {(selectedEmpId === row?.employee?.id) && isPending ? <Loader className="animate-spin text-white"/>:<Check />} Mark Present
                            </Button>
                        }
                      </div>
                    );
                },
            },
        ];

    
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[750px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Take {data?.title} Attendance</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <div className="px-5">
                    <div>
                        <div className="grid grid-cols-3 divide-x-1 divide-gray-300 gap-x-5">
                            <div>
                                <TextLabel variant="dark"  title={"Expected Attendees"} subTitle={<span className="text-green-600 font-bold">{commaSeparator(attendees?.pagination?.total)}</span>} />
                            </div>
                            <div>
                                <TextLabel variant="dark" title={"Attendees"} subTitle={<span className="text-green-600 font-bold">{commaSeparator(attendees?.present)}</span>} />
                            </div>
                            <div>
                                <TextLabel variant="dark" title={"Absentees"} subTitle={<span className="text-green-600 font-bold">{commaSeparator(attendees?.absent)}</span>} />
                            </div>
                        </div>
                        <div className="h-[500px] overflow-y-auto">
                            <CustomTable
                                searchFilter={<AttendanceSearch setFilters={setFilters} refetch={refetchAttendees} isLoading={isLoading} />}
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
                    
                </div>
                <DialogFooter className="flex !justify-between p-5 bg-[#F8FAFC]">
                    <Button type="button" className="w-full" variant={"default"} onClick={() => setOpen(false)}>Done</Button>
                    {/* <Button onClick={handleDelete} type="button" variant={"destructive"}>
                        <LoadingLabel isLoading={isPending}>
                            Yes, Delete
                        </LoadingLabel>
                    </Button> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}