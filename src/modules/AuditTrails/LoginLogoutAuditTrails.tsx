"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import CustomTable, { IPagination } from "@/components/CustomTable";
import { Badge } from "@/components/ui/badge";
import { PAGE_SIZE } from "@/lib/constants";
import { formatDateReadable } from "@/lib/helpers";
import { LoginLogoutAuditTrailEntry, LoginLogoutAuditTrailFilters, useLoginLogoutAuditTrail } from "@/apis/useLoginLogoutAuditTrail";
import LoginLogoutAuditSearch from "./LoginLogoutAuditSearch";

export default function LoginLogoutAuditTrails() {
  const [filters, setFilters] = useState<LoginLogoutAuditTrailFilters>({
    page: 1,
    page_size: PAGE_SIZE,
  });

  const { data, isLoading, refetch } = useLoginLogoutAuditTrail({ queryParams: filters });

  const handlePaginationChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };
  const handleSetPageSize = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, page_size: pageSize }));
  };

  const columns: ColumnDef<LoginLogoutAuditTrailEntry>[] = [
    {
      header: "Date",
      accessorKey: "date_created",
      cell: (_row) => (
        <div>{formatDateReadable(_row.row.original?.date_created, "Do MMMM, YYYY - hh:mm A")}</div>
      ),
    },
    {
      header: "User",
      accessorKey: "user",
      cell: (_row) => {
        const user = _row.row.original?.created_by;
        return (
          <div className="capitalize">
            {user?.first_name} {user?.last_name}
          </div>
        );
      },
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (_row) => _row.row.original?.created_by?.email || "N/A",
    },
    {
      header: "Phone Number",
      accessorKey: "phone_number",
      cell: (_row) => _row.row.original?.created_by?.phone_number || "N/A",
    },
    {
      header: "Activity",
      accessorKey: "type",
      cell: (_row) => {
        const type = _row.row.original?.type;
        return (
          <Badge variant={type === "LOGIN" ? "success" : "dark"} className="capitalize">
            {String(type).toLowerCase()}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="mt-5">
      <CustomTable
        searchFilter={<LoginLogoutAuditSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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
    </div>
  );
}
