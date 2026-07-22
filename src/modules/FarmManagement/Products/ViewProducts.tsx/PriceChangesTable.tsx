"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { usePriceHistory } from "@/apis/priceApi";
import CustomTable, { IPagination } from "@/components/CustomTable";
import { CEDI, PAGE_SIZE } from "@/lib/constants";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";

function getCurrencyLabel(currency?: string) {
  if (currency === "GH") {
    return CEDI;
  }

  return currency || "";
}

function getUserName(user: any) {
  if (!user) {
    return "N/A";
  }

  return `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.email || "N/A";
}

export default function PriceChangesTable({ product }: { product?: any }) {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: PAGE_SIZE,
  });

  const { data, isLoading } = usePriceHistory(
    {
      queryParams: {
        ...filters,
        product: String(product?.id || ""),
      },
    },
    { enabled: !!product?.id },
  );

  const columns: ColumnDef<any>[] = [
    {
      header: "Date",
      accessorKey: "created_at",
      cell: (_row) => {
        const date = _row.row.original?.created_at || _row.row.original?.date_created;
        return date ? formatDateReadable(date) : "N/A";
      },
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (_row) => {
        const row = _row.row.original;
        return (
          <span className="font-medium">
            {getCurrencyLabel(row?.price_currency)} {commaSeparator(row?.price || 0)}
          </span>
        );
      },
    },
    {
      header: "Currency",
      accessorKey: "price_currency",
      cell: (_row) => _row.row.original?.price_currency || "N/A",
    },
    {
      header: "Updated By",
      accessorKey: "created_by",
      cell: (_row) => getUserName(_row.row.original?.created_by),
    },
  ];

  return (
    <div>
      <CustomTable
        columns={columns}
        data={data?.results || []}
        setPerPage={(pageSize) => setFilters((prev) => ({ ...prev, page_size: pageSize }))}
        perPage={filters.page_size || PAGE_SIZE}
        isLoading={isLoading}
        currentPage={filters.page}
        count={data?.pagination?.total || 0}
        handlePaginationChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        pagination={data?.pagination as IPagination}
      />
    </div>
  );
}
