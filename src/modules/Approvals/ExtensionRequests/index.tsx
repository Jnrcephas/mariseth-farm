"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Sprout } from "lucide-react";
import { ExtensionRequest, ExtensionRequestFilters, useExtensionRequests } from "@/apis/extensionRequestApi";
import CustomTable, { IPagination } from "@/components/CustomTable";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PAGE_SIZE } from "@/lib/constants";
import { formatDateReadable } from "@/lib/helpers";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import ExtensionRequestSearch from "./ExtensionRequestSearch";
import ReviewExtensionRequestModal from "./ReviewExtensionRequestModal";

const FILTER_STORAGE_KEY = "extension-request-filters";
const defaultFilters: ExtensionRequestFilters = {
  page: 1,
  page_size: PAGE_SIZE,
  status: "pending",
};

function getInitialFilters(): ExtensionRequestFilters {
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

function getFarmerName(farmer: ExtensionRequest["farmer"]) {
  if (!farmer) return "N/A";
  return [farmer.first_name, farmer.last_name, farmer.other_names].filter(Boolean).join(" ") || "N/A";
}

export default function ExtensionRequests() {
  const [filters, setFilters] = useState<ExtensionRequestFilters>(getInitialFilters);
  const [selected, setSelected] = useState<ExtensionRequest | Record<string, never>>({});
  const [reviewModal, setReviewModal] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    window.sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const { data, isLoading, refetch } = useExtensionRequests({ queryParams: filters });

  const handlePaginationChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSetPageSize = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, page_size: pageSize }));
  };

  const openReviewModal = (row: ExtensionRequest, action: "approve" | "reject") => {
    setSelected(row);
    setReviewModal(action);
  };

  const columns: ColumnDef<ExtensionRequest>[] = [
    { header: "Request ID", accessorKey: "id" },
    {
      header: "Phone Number",
      accessorKey: "phone_number",
      cell: (_row) => _row.row.original?.phone_number || "N/A",
    },
    {
      header: "Farmer",
      accessorKey: "farmer",
      cell: (_row) => getFarmerName(_row.row.original?.farmer),
    },
    {
      header: "Reason",
      accessorKey: "reason",
      cell: (_row) => {
        const reason = _row.row.original?.reason;
        if (!reason) return "N/A";
        return (
          <span className="line-clamp-2 max-w-[220px]" title={reason}>
            {reason}
          </span>
        );
      },
    },
    {
      header: "Channel",
      accessorKey: "request_channel",
      cell: (_row) => <span className="uppercase">{_row.row.original?.request_channel || "N/A"}</span>,
    },
    {
      header: "Date",
      accessorKey: "date_created",
      cell: (_row) => {
        const date = _row.row.original?.date_created;
        return <div>{date ? formatDateReadable(date) : "N/A"}</div>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (_row) => {
        const status = _row.row.original?.status || "pending";
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
        const isPending = String(row?.status || "pending").toLowerCase() === "pending";
        if (!isPending) return null;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <EllipsisVertical className="text-[#4A8D34]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer" onClick={() => openReviewModal(row, "approve")}>
                Approve Request
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-500" onClick={() => openReviewModal(row, "reject")}>
                Reject Request
              </DropdownMenuItem>
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
          <div className="rounded-full p-2.5 flex items-center justify-center bg-[#DBEAFE]">
            <Sprout className="h-5 w-5 text-[#2563EB]" />
          </div>
          <div>
            <span className="text-sm text-[#475569] font-medium">Total Extension Requests</span>
            <p className="text-2xl font-bold text-black">{data?.pagination?.total ?? 0}</p>
          </div>
        </div>
      </Card>
      <CustomTable
        searchFilter={<ExtensionRequestSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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

      {reviewModal && (
        <ReviewExtensionRequestModal
          open={!!reviewModal}
          setOpen={(open) => setReviewModal(open ? reviewModal : null)}
          defaultData={selected}
          refetch={refetch}
          action={reviewModal}
        />
      )}
    </div>
  );
}
