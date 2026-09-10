import { IPagination } from "@/components/CustomTable";

export const MANAGER_ACCOUNTING_PAGE_SIZE = 50;

export interface ManagerAccountingFilters {
  skip: number;
  pageSize: number;
  sortBy?: string;
  sortByDesc?: boolean;
}

export const defaultManagerAccountingFilters: ManagerAccountingFilters = {
  skip: 0,
  pageSize: MANAGER_ACCOUNTING_PAGE_SIZE,
  sortBy: "Date",
  sortByDesc: true,
};

/**
 * Manager.io paginates with skip/pageSize/totalRecords instead of the
 * page/page_size/pagination shape our own API uses elsewhere. CustomTable
 * only understands the latter, so this adapts one to the other.
 */
export function toIPagination(
  skip: number,
  pageSize: number,
  totalRecords: number,
): IPagination {
  const safePageSize = pageSize || MANAGER_ACCOUNTING_PAGE_SIZE;
  const page = Math.floor(skip / safePageSize) + 1;
  const pages = Math.max(1, Math.ceil(totalRecords / safePageSize));
  return {
    total: totalRecords,
    page,
    pages,
    has_next: skip + safePageSize < totalRecords,
    has_previous: skip > 0,
  };
}

export function skipFromPage(page: number, pageSize: number) {
  return (page - 1) * (pageSize || MANAGER_ACCOUNTING_PAGE_SIZE);
}

/**
 * Formats a Manager.io money object ({ value, currency }) as e.g. "GHS 450,064.00".
 * Manager.io returns mixed currencies (GHS, USD, etc.) across rows, so we
 * always show the currency the row itself is denominated in rather than a
 * fixed symbol like the CEDI constant used elsewhere in Accounting.
 */
export function formatManagerMoney(
  money?: { value?: number; currency?: string } | null,
) {
  if (!money || money.value === undefined || money.value === null) return "—";
  const amount = money.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return money.currency ? `${money.currency} ${amount}` : amount;
}
