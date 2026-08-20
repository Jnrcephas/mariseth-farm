"use client"
import CustomTable from "@/components/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useManagerAccountingSalesInvoicesList } from "@/apis/adminApiComponents";
import { formatDateReadable } from "@/lib/helpers";
import {
  ManagerAccountingFilters,
  defaultManagerAccountingFilters,
  formatManagerMoney,
  skipFromPage,
  toIPagination,
} from "./utils";

type SalesInvoiceRow = {
  key?: string;
  issueDate?: string;
  reference?: string | null;
  customer?: string;
  description?: string;
  invoiceAmount?: { value?: number; currency?: string };
  balanceDue?: { value?: number; currency?: string };
  status?: string;
};

export default function SalesInvoices() {
  const [filters, setFilters] = useState<ManagerAccountingFilters>(
    defaultManagerAccountingFilters,
  );

  const { data, isLoading } = useManagerAccountingSalesInvoicesList({
    queryParams: filters,
  });

  const handlePaginationChange = (page: number) => {
    setFilters((prev) => ({ ...prev, skip: skipFromPage(page, prev.pageSize) }));
  };
  const handleSetPageSize = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, skip: 0 }));
  };

  const columns: ColumnDef<SalesInvoiceRow>[] = [
    {
      header: "Issue Date",
      accessorKey: "issueDate",
      cell: (_row) => <div>{formatDateReadable(_row.row.original?.issueDate)}</div>,
    },
    { header: "Customer", accessorKey: "customer" },
    { header: "Description", accessorKey: "description" },
    {
      header: "Reference",
      accessorKey: "reference",
      cell: (_row) => <div>{_row.row.original?.reference || "—"}</div>,
    },
    {
      header: "Invoice Amount",
      accessorKey: "invoiceAmount",
      cell: (_row) => <div>{formatManagerMoney(_row.row.original?.invoiceAmount)}</div>,
    },
    {
      header: "Balance Due",
      accessorKey: "balanceDue",
      cell: (_row) => <div>{formatManagerMoney(_row.row.original?.balanceDue)}</div>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (_row) => {
        const status = _row.row.original?.status;
        return (
          <span className="inline-flex items-center rounded-full bg-[#F0FDF4] text-[#166534] px-3 py-1 text-xs font-medium">
            {status || "—"}
          </span>
        );
      },
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={data?.salesInvoices || []}
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
