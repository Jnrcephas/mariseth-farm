"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { type FarmerProfileUpdateRequestFilters, useFarmerProfileUpdateRequests } from "@/apis/farmerRequestApi";
import CustomTable, { IPagination } from "@/components/CustomTable";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { formatDateReadable, formatText } from "@/lib/helpers";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import FarmerProfileUpdateRequestSearch from "./FarmerProfileUpdateRequestSearch";
import ReviewProfileUpdateRequestModal from "./ReviewProfileUpdateRequestModal";

const FILTER_STORAGE_KEY = "farmer-profile-update-request-filters";
const defaultFilters = {
  page: 1,
  page_size: PAGE_SIZE,
  status: "pending",
};

function getInitialFilters(): FarmerProfileUpdateRequestFilters {
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

function getDate(row: any) {
  return row?.created_at || row?.date_created || row?.requested_at;
}

function getUpdateValues(row: any) {
  const oldValue = row?.old_value ?? row?.current_value ?? row?.previous_value;
  const newValue = row?.value ?? row?.new_value;

  return {
    hasOldValue: Boolean(oldValue),
    oldValue: oldValue || "N/A",
    newValue: newValue || "N/A",
  };
}

export default function FarmerProfileUpdateRequests() {
  const [filters, setFilters] = useState<FarmerProfileUpdateRequestFilters>(getInitialFilters);
  const [selected, setSelected] = useState<any>({});
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");
  const [reviewModal, setReviewModal] = useState(false);

  useEffect(() => {
    window.sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const { data, isLoading, refetch } = useFarmerProfileUpdateRequests({
    queryParams: filters,
  });

  const requests = Array.isArray(data) ? data : data?.results || [];
  const pagination = Array.isArray(data) ? undefined : data?.pagination;

  const handlePaginationChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSetPageSize = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, page_size: pageSize }));
  };

  const openReviewModal = (row: any, action: "approve" | "reject") => {
    setSelected(row);
    setReviewAction(action);
    setReviewModal(true);
  };

  const columns: ColumnDef<any>[] = [
    { header: "Request ID", accessorKey: "id" },
    {
      header: "Phone Number",
      accessorKey: "phone_number",
      cell: (_row) => _row.row.original?.phone_number || "N/A",
    },
    {
      header: "Update",
      accessorKey: "update_value",
      cell: (_row) => {
        const row = _row.row.original;
        const { hasOldValue, oldValue, newValue } = getUpdateValues(row);

        return (
          <div className="max-w-[280px]">
            <p className="inline-flex max-w-full rounded-full bg-[#E8F3E4] px-2 py-0.5 text-xs font-semibold capitalize text-[#2F6B1F]">
              {formatText(row?.update_value || "N/A")}
            </p>
            <div className="mt-1 flex min-w-0 items-center gap-2 text-xs">
              {hasOldValue && (
                <>
                  <span className="max-w-[95px] truncate text-muted-foreground line-through" title={String(oldValue)}>
                    {oldValue}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </>
              )}
              <span className="max-w-[150px] truncate rounded-full bg-[#F1F8EE] px-2 py-0.5 font-medium text-[#2F6B1F]" title={String(newValue)}>
                {newValue}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Reason",
      accessorKey: "reason",
      cell: (_row) => {
        const reason = _row.row.original?.reason || "N/A";
        return (
          <div className="max-w-[260px] truncate" title={reason}>
            {reason}
          </div>
        );
      },
    },
    {
      header: "Channel",
      accessorKey: "request_channel",
      cell: (_row) => _row.row.original?.request_channel || "N/A",
    },
    {
      header: "Date",
      accessorKey: "created_at",
      cell: (_row) => {
        const date = getDate(_row.row.original);
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
        const status = String(row?.status || "pending").toLowerCase();

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <EllipsisVertical className="text-[#4A8D34]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href={`${routeTo.viewFarmerProfileUpdateRequest}/${row?.id}?type=profile-update`}>
                <DropdownMenuItem className="cursor-pointer">
                  View
                </DropdownMenuItem>
              </Link>
              {status === "pending" && (
                <>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => openReviewModal(row, "approve")}>
                    Approve Request
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-500" onClick={() => openReviewModal(row, "reject")}>
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
    <div>
      <CustomTable
        searchFilter={<FarmerProfileUpdateRequestSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
        columns={columns}
        data={requests}
        setPerPage={handleSetPageSize}
        perPage={filters.page_size || PAGE_SIZE}
        isLoading={isLoading}
        currentPage={filters.page}
        count={pagination?.total || requests.length || 0}
        handlePaginationChange={handlePaginationChange}
        pagination={pagination as IPagination}
      />

      {reviewModal && (
        <ReviewProfileUpdateRequestModal
          open={reviewModal}
          setOpen={setReviewModal}
          defaultData={selected}
          refetch={refetch}
          action={reviewAction}
        />
      )}
    </div>
  );
}
