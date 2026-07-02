"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { CirclePlus, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useAccountsUsersAdminList } from "@/apis/adminApiComponents";
import { FilterPropsAdmin } from "../utils/types";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import DeleteUserModal from "./Modals/DeleteUserModal";
import DeactivateUserModal from "./Modals/DeactivateUserModal";
import UserSearch from "./UserSearch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/app/providers/user-store-provider";
import { Button } from "@/components/ui/button";
import { formatGender } from "@/lib/helpers";

export default function UserAccounts() {

    const { user } = useUserStore((user) => user)
    const route = useRouter()

    const [deleteModal, setDeleteModal] = useState(false)
    const [deactivateModal, setDeactivateModal] = useState(false)
    const [selected, setSelected] = useState<any>({})

    const [filters, setFilters] = useState<FilterPropsAdmin>({
        page: 1, page_size: PAGE_SIZE, user_type: "admin"
    })

    const { data, isLoading, refetch } = useAccountsUsersAdminList({ queryParams: filters })

    function handleDeleteModal(data: any) {
        setSelected(data)
        setDeleteModal(true)
    }
    // function handleDeactivateModal(data: any){
    //     setSelected(data)
    //     setDeactivateModal(true)
    // }

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize }))
    }

    const columns: ColumnDef<any>[] = [
        {
            header: "User ID", accessorKey: "id",
            cell: (_row) => {
                const row = _row.cell.row.original
                return (
                    <div className="">
                        {row?.first_name?.[0]}{row?.last_name?.[0]}-{row?.id}
                    </div>
                );
            }
        },
        {
            header: "Name", accessorKey: "name",
            cell: (_row) => {
                const row = _row.cell.row.original
                return (
                    <div className="flex flex-row gap-3 items-center">
                        <Avatar className="border">
                            <AvatarImage src={row?.avatar || ""} />
                            <AvatarFallback className='capitalize text-[#4A8D34]'>{row?.first_name?.[0]}{row?.last_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div>
                                {row?.first_name} {row?.last_name}
                            </div>
                            <div>
                                {row?.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Gender", accessorKey: "gender",
            cell: (_row) => {
                const row = _row.cell.row.original
                return (
                    <div className="">
                        {formatGender(row?.gender)}
                    </div>
                );
            }
        },
        { header: "Phone Number", accessorKey: "phone_number" },
        {
            header: "Role", accessorKey: "role",
            cell: (_row) => {
                const row = _row.cell.row.original
                return (
                    <div className="">
                        {row?.groups?.[0]?.name}
                    </div>
                );
            }
        },
        {
            header: "Status", accessorKey: "status",
            cell: () => {
                // const row =  _row.cell.row.original
                return (
                    <div className="">
                        <Badge variant={statusBadgeMap["active"]} className="capitalize">
                            Active
                        </Badge>
                    </div>
                );
            },
        },
        {
            header: "Action", accessorKey: "action",
            cell: (_row) => {
                const row = _row.cell.row.original
                return (
                    <div className="">
                        {user?.id === row?.id ? <span className="text-body-sm rounded-md bg-[#EFF6FF] px-3 py-1.5 font-medium text-[#2563EB]">ME
                        </span> :
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="cursor-pointer">
                                    <EllipsisVertical className="text-[#4A8D34]" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {/* <DropdownMenuItem className="cursor-pointer" onClick={() => route.push(`#`)}>View </DropdownMenuItem> */}
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => route.push(`${routeTo.editUserAccount}/${row?.id}`)}>Edit </DropdownMenuItem>
                                    {/* <DropdownMenuItem className="cursor-pointer" onClick={() => handleDeactivateModal(row)}>Deactivate </DropdownMenuItem> */}
                                    <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => handleDeleteModal(row)}>Delete </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>}
                    </div>
                );
            },
        },
    ];
    return (
        <div className="mt-3">
            <div className="flex justify-between">
                <div className="font-semibold text-black mb-8">
                    User Management
                </div>
                <Button className="bg-[#4A8D34] text-white cursor-pointer" onClick={() => route.push(routeTo.addUserAccount)}>
                    <CirclePlus />
                    Add New User
                </Button>
            </div>
            <CustomTable
                searchFilter={<UserSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
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
                <DeleteUserModal
                    open={deleteModal}
                    setOpen={setDeleteModal}
                    data={selected}
                    refetch={refetch}
                />
            }
            {deactivateModal &&
                <DeactivateUserModal
                    open={deactivateModal}
                    setOpen={setDeactivateModal}
                    data={selected}
                    refetch={refetch}
                />
            }
        </div>
    )
}