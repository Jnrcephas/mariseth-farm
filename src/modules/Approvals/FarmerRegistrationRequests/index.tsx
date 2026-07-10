"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, UserCheck } from "lucide-react";
import Link from "next/link";
import { type FarmerRegistrationRequestFilters, useFarmerRegistrationRequests } from "@/apis/farmerRequestApi";
import CustomTable, { IPagination } from "@/components/CustomTable";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { formatDateReadable } from "@/lib/helpers";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import ApproveFarmerRequestModal from "./ApproveFarmerRequestModal";
import FarmerRegistrationRequestSearch from "./FarmerRegistrationRequestSearch";
import RejectFarmerRequestModal from "./RejectFarmerRequestModal";

const FILTER_STORAGE_KEY = "farmer-registration-request-filters";
const defaultFilters = {
  page: 1,
  page_size: PAGE_SIZE,
  status: "pending",
};

function getInitialFilters(): FarmerRegistrationRequestFilters {
  if (typeof window === "undefined") {
    return defaultFilters;
  }

  try {
    const storedFilters = window.sessionStorage.getItem(FILTER_STORAGE_KEY);
    return storedFilters ? { ...defaultFilters, ...JSON.parse(storedFilters) } : defaultFilters;
  } catch {
    return defaultFilters;
  }
}

export default function FarmerRegistrationRequests() {
  const [filters, setFilters] = useState<FarmerRegistrationRequestFilters>(getInitialFilters);
  const [selected, setSelected] = useState<any>({});
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  useEffect(() => {
    window.sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const { data, isLoading, refetch } = useFarmerRegistrationRequests({
    queryParams: filters,
  });

  const handlePaginationChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSetPageSize = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, page_size: pageSize }));
  };

  const openApproveModal = (row: any) => {
    setSelected(row);
    setApproveModal(true);
  };

  const openRejectModal = (row: any) => {
    setSelected(row);
    setRejectModal(true);
  };

  const columns: ColumnDef<any>[] = [
    { header: "Request ID", accessorKey: "id" },
    {
      header: "Farmer Name",
      accessorKey: "farmer_name",
      cell: (_row) => {
        const row = _row.row.original;
        return (
          <div className="capitalize">
            {row?.farmer_name || `${row?.first_name || ""} ${row?.last_name || ""}`}
          </div>
        );
      },
    },
    {
      header: "Phone Number",
      accessorKey: "phone_number",
      cell: (_row) => _row.row.original?.phone_number || "N/A",
    },
    {
      header: "Region",
      accessorKey: "region",
      cell: (_row) => _row.row.original?.region?.name || _row.row.original?.region || "N/A",
    },
    {
      header: "District",
      accessorKey: "district",
      cell: (_row) => _row.row.original?.district?.name || _row.row.original?.district || "N/A",
    },
    {
      header: "Date",
      accessorKey: "created_at",
      cell: (_row) => {
        const date = _row.row.original?.created_at || _row.row.original?.date_created;
        return <div>{date ? formatDateReadable(date) : "N/A"}</div>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (_row) => {
        const status = _row.row.original?.status || _row.row.original?.approval_status || "pending";
        return (
          <Badge variant={statusBadgeMap[String(status).toLowerCase()] || "warning"} className="capitalize">
            {String(status).replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: (_row) => {
        const row = _row.row.original;
        const status = String(row?.status || row?.approval_status || "pending").toLowerCase();
        const isPending = status === "pending";
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <EllipsisVertical className="text-[#4A8D34]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href={`${routeTo.viewFarmerRegistrationRequest}/${row?.id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  View
                </DropdownMenuItem>
              </Link>
              {isPending && (
                <>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => openApproveModal(row)}>
                    Approve Request
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-500" onClick={() => openRejectModal(row)}>
                    Reject Request
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="mt-5">
      <Card className="p-5 shadow-none border border-[#E2E8F0] mb-5 w-full sm:w-fit">
          <div className="flex items-center gap-4">
              <div className="rounded-full p-2.5 flex items-center justify-center bg-[#EDE9FE]">
                  <UserCheck className="h-5 w-5 text-[#7C3AED]" />
              </div>
              <div>
                  <span className="text-sm text-[#475569] font-medium">Total Farmer Registration Requests</span>
                  <p className="text-2xl font-bold text-black">{data?.pagination?.total ?? 0}</p>
              </div>
          </div>
      </Card>
      <CustomTable
        searchFilter={<FarmerRegistrationRequestSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
        columns={columns}
        data={data?.results || []}
        setPerPage={handleSetPageSize}
        perPage={filters.page_size || PAGE_SIZE}
        isLoading={isLoading}
        currentPage={filters.page}
        count={data?.pagination?.total || 0}
        handlePaginationChange={handlePaginationChange}
        pagination={data?.pagination as IPagination}
      />

      {approveModal && (
        <ApproveFarmerRequestModal
          open={approveModal}
          setOpen={setApproveModal}
          defaultData={selected}
        />
      )}
      {rejectModal && (
        <RejectFarmerRequestModal
          open={rejectModal}
          setOpen={setRejectModal}
          defaultData={selected}
          refetch={refetch}
        />
      )}
    </div>
  );
}
