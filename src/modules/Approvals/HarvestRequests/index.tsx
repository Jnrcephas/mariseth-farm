"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Wheat } from "lucide-react";
import { HarvestRequest, HarvestRequestFilters, useHarvestRequests } from "@/apis/harvestRequestApi";
import CustomTable, { IPagination } from "@/components/CustomTable";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PAGE_SIZE } from "@/lib/constants";
import { formatDateReadable } from "@/lib/helpers";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import HarvestRequestSearch from "./HarvestRequestSearch";
import ReviewHarvestRequestModal from "./ReviewHarvestRequestModal";

const FILTER_STORAGE_KEY = "harvest-request-filters";
const defaultFilters: HarvestRequestFilters = {
  page: 1,
  page_size: PAGE_SIZE,
  status: "pending",
};

function getInitialFilters(): HarvestRequestFilters {
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

export default function HarvestRequests() {
  const [filters, setFilters] = useState<HarvestRequestFilters>(getInitialFilters);
  const [selected, setSelected] = useState<HarvestRequest | Record<string, never>>({});
  const [reviewModal, setReviewModal] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    window.sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const { data, isLoading, refetch } = useHarvestRequests({ queryParams: filters });

  const handlePaginationChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSetPageSize = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, page_size: pageSize }));
  };

  const openReviewModal = (row: HarvestRequest, action: "approve" | "reject") => {
    setSelected(row);
    setReviewModal(action);
  };

  const columns: ColumnDef<HarvestRequest>[] = [
    { header: "Request ID", accessorKey: "id" },
    {
      header: "Phone Number",
      accessorKey: "phone_number",
      cell: (_row) => _row.row.original?.phone_number || "N/A",
    },
    {
      header: "Product",
      accessorKey: "product",
      cell: (_row) => {
        const product = _row.row.original?.product;
        if (!product) return "N/A";
        return (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: product.color }} />
            {product.name}
          </div>
        );
      },
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      cell: (_row) => _row.row.original?.quantity ?? "N/A",
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
          <div className="rounded-full p-2.5 flex items-center justify-center bg-[#FEF3C7]">
            <Wheat className="h-5 w-5 text-[#D97706]" />
          </div>
          <div>
            <span className="text-sm text-[#475569] font-medium">Total Harvest Requests</span>
            <p className="text-2xl font-bold text-black">{data?.pagination?.total ?? 0}</p>
          </div>
        </div>
      </Card>
      <CustomTable
        searchFilter={<HarvestRequestSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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
        <ReviewHarvestRequestModal
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
