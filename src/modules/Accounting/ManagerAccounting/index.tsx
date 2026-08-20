"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTitle from "@/components/layouts/PageTitle";
import Unauthorized from "@/components/Unauthorized";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import SalesInvoices from "./SalesInvoices";
import Payments from "./Payments";
import Receipts from "./Receipts";

export default function ManagerAccountingView() {
  const { hasAccess: list_sales_invoices, loading: loadingSalesInvoices } = useHasAccess(
    "manager_accounting|list_sales_invoices",
  );
  const { hasAccess: list_payments, loading: loadingPayments } = useHasAccess(
    "manager_accounting|list_payments",
  );
  const { hasAccess: list_receipts, loading: loadingReceipts } = useHasAccess(
    "manager_accounting|list_receipts",
  );

  const loading = loadingSalesInvoices || loadingPayments || loadingReceipts;
  const hasAnyAccess = list_sales_invoices || list_payments || list_receipts;

  const defaultTab = list_sales_invoices
    ? "sales-invoices"
    : list_payments
      ? "payments"
      : "receipts";

  if (loading) return null;

  if (!hasAnyAccess) {
    return (
      <>
        <PageTitle title="Manager Accounting" />
        <Unauthorized />
      </>
    );
  }

  return (
    <>
      <PageTitle title="Manager Accounting" />
      {/* Live, read-only view of Manager.io - nothing shown here is stored
         in our own database, every load hits Manager.io directly. */}
      <Tabs defaultValue={defaultTab} className="w-full mx-auto">
        <TabsList className="grid w-full sm:w-[520px] grid-cols-3 h-auto p-1 bg-[#E2E8F0] rounded-full mb-5">
          {list_sales_invoices && (
            <TabsTrigger
              className="h-[38px] rounded-full cursor-pointer font-semibold data-[state=active]:bg-[#0B3D19] data-[state=active]:text-white"
              value="sales-invoices"
            >
              Sales Invoices
            </TabsTrigger>
          )}
          {list_payments && (
            <TabsTrigger
              className="h-[38px] rounded-full cursor-pointer font-semibold data-[state=active]:bg-[#0B3D19] data-[state=active]:text-white"
              value="payments"
            >
              Payments
            </TabsTrigger>
          )}
          {list_receipts && (
            <TabsTrigger
              className="h-[38px] rounded-full cursor-pointer font-semibold data-[state=active]:bg-[#0B3D19] data-[state=active]:text-white"
              value="receipts"
            >
              Receipts
            </TabsTrigger>
          )}
        </TabsList>
        {list_sales_invoices && (
          <TabsContent value="sales-invoices">
            <SalesInvoices />
          </TabsContent>
        )}
        {list_payments && (
          <TabsContent value="payments">
            <Payments />
          </TabsContent>
        )}
        {list_receipts && (
          <TabsContent value="receipts">
            <Receipts />
          </TabsContent>
        )}
      </Tabs>
    </>
  );
}
