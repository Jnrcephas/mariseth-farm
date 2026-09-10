"use client"
import CustomTable from "@/components/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useManagerAccountingPaymentsList } from "@/apis/adminApiComponents";
import { formatDateReadable } from "@/lib/helpers";
import {
  ManagerAccountingFilters,
  defaultManagerAccountingFilters,
  formatManagerMoney,
  skipFromPage,
  toIPagination,
} from "./utils";

type PaymentRow = {
  key?: string;
  date?: string;
  paidFrom?: string;
  description?: string;
  payee?: string;
  amount?: { value?: number; currency?: string };
};

export default function Payments() {
  const [filters, setFilters] = useState<ManagerAccountingFilters>(
    defaultManagerAccountingFilters,
  );

  const { data, isLoading } = useManagerAccountingPaymentsList({
    queryParams: filters,
  });

  const handlePaginationChange = (page: number) => {
    setFilters((prev) => ({ ...prev, skip: skipFromPage(page, prev.pageSize) }));
  };
  const handleSetPageSize = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, skip: 0 }));
  };

  const columns: ColumnDef<PaymentRow>[] = [
    {
      header: "Date",
      accessorKey: "date",
      cell: (_row) => <div>{formatDateReadable(_row.row.original?.date)}</div>,
    },
    { header: "Payee", accessorKey: "payee" },
    { header: "Description", accessorKey: "description" },
    { header: "Paid From", accessorKey: "paidFrom" },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (_row) => <div>{formatManagerMoney(_row.row.original?.amount)}</div>,
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={data?.payments || []}
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
