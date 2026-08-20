"use client"
import CustomTable from "@/components/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useManagerAccountingReceiptsList } from "@/apis/adminApiComponents";
import { formatDateReadable } from "@/lib/helpers";
import {
  ManagerAccountingFilters,
  defaultManagerAccountingFilters,
  formatManagerMoney,
  skipFromPage,
  toIPagination,
} from "./utils";

type ReceiptRow = {
  key?: string;
  date?: string;
  reference?: string | null;
  receivedIn?: { key?: string; name?: string };
  description?: string;
  paidBy?: string;
  amount?: { value?: number; currency?: string };
};

export default function Receipts() {
  const [filters, setFilters] = useState<ManagerAccountingFilters>(
    defaultManagerAccountingFilters,
  );

  const { data, isLoading } = useManagerAccountingReceiptsList({
    queryParams: filters,
  });

  const handlePaginationChange = (page: number) => {
    setFilters((prev) => ({ ...prev, skip: skipFromPage(page, prev.pageSize) }));
  };
  const handleSetPageSize = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, skip: 0 }));
  };

  const columns: ColumnDef<ReceiptRow>[] = [
    {
      header: "Date",
      accessorKey: "date",
      cell: (_row) => <div>{formatDateReadable(_row.row.original?.date)}</div>,
    },
    { header: "Paid By", accessorKey: "paidBy" },
    { header: "Description", accessorKey: "description" },
    {
      header: "Received In",
      accessorKey: "receivedIn",
      cell: (_row) => <div>{_row.row.original?.receivedIn?.name || "—"}</div>,
    },
    {
      header: "Reference",
      accessorKey: "reference",
      cell: (_row) => <div>{_row.row.original?.reference || "—"}</div>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (_row) => <div>{formatManagerMoney(_row.row.original?.amount)}</div>,
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={data?.receipts || []}
      setPerPage={handleSetPageSize}
      perPage={filters.pageSize}
      isLoading={isLoading}
      currentPage={Math.floor(filters.skip / filters.pageSize) + 1}
      count={data?.totalRecords || 0}
      handlePaginationChange={handlePaginationChange}
      pagination={toIPagination(filters.skip, filters.pageSize, data?.totalRecords || 0)}
    />
  );
}
