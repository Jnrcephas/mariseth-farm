"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Save, Search } from "lucide-react";
import { toast } from "sonner";
import { useCustomTypeList, useFarmManagementProductList } from "@/apis/adminApiComponents";
import { type PriceHistoryFilters, usePriceHistory, useUpdatePrices } from "@/apis/priceApi";
import CustomTable, { IPagination } from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingLabel } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CEDI, PAGE_SIZE } from "@/lib/constants";
import { commaSeparator, formatDateReadable, getErrorMap } from "@/lib/helpers";

const CURRENCY_OPTIONS = [
  { label: "All Currencies", value: "all" },
  { label: "GH", value: "GH" },
];

function getUserName(user: any) {
  if (!user) {
    return "N/A";
  }

  return `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.email || "N/A";
}

function getCurrencyLabel(currency?: string) {
  if (currency === "GH") {
    return CEDI;
  }

  return currency || "";
}

function PriceInputCell({
  productId,
  currentPrice,
  onPriceChange,
  resetKey,
}: {
  productId: string;
  currentPrice?: string | number | null;
  onPriceChange: (productId: string, value: string) => void;
  resetKey: number;
}) {
  const currentValue = currentPrice === null || currentPrice === undefined ? "" : String(currentPrice);
  const [value, setValue] = useState(currentValue);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue, productId, resetKey]);

  return (
    <div className="relative max-w-[180px]">
      <span className="absolute left-3 top-2 text-xs font-medium text-[#4A8D34]">
        {CEDI}
      </span>
      <Input
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        className="pl-12"
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value;
          setValue(nextValue);
          onPriceChange(productId, nextValue);
        }}
      />
    </div>
  );
}

function PriceUpdatePanel() {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: PAGE_SIZE,
    type: "crop",
  } as {
    page: number;
    page_size: number;
    type: string;
    query?: string;
    category?: number;
  });
  const [searchValues, setSearchValues] = useState({
    query: "",
    category: "all",
  });
  const draftPricesRef = useRef<Record<string, string>>({});
  const [resetKey, setResetKey] = useState(0);

  const { data, isLoading, refetch } = useFarmManagementProductList({
    queryParams: filters,
  });
  const { data: categoriesData } = useCustomTypeList({
    queryParams: {
      page: 1,
      page_size: 50,
      query: "product_crop_category",
    },
  });

  const { mutate, isPending } = useUpdatePrices({
    onSuccess: () => {
      toast.success("Prices updated successfully");
      draftPricesRef.current = {};
      setResetKey((prev) => prev + 1);
      refetch();
    },
    onError: (error: any) => {
      toast.error(getErrorMap(error));
    },
  });

  const handlePriceChange = useCallback((productId: string, value: string) => {
    draftPricesRef.current[productId] = value;
  }, []);

  function handleUpdatePrices() {
    const priceList = Object.entries(draftPricesRef.current)
      .filter(([, price]) => price !== "" && Number(price) > 0)
      .map(([product, price]) => ({
        product,
        price: Number(price),
      }));

    if (!priceList.length) {
      toast.error("Enter at least one product price");
      return;
    }

    mutate({
      body: {
        price_list: priceList,
      },
    });
  }

  function handleSearch() {
    setFilters((prev) => ({
      page: 1,
      page_size: prev.page_size,
      type: "crop",
      ...(searchValues.query ? { query: searchValues.query } : {}),
      ...(searchValues.category !== "all" ? { category: Number(searchValues.category) } : {}),
    }));
  }

  function handleReset() {
    setSearchValues({
      query: "",
      category: "all",
    });
    setFilters({
      page: 1,
      page_size: PAGE_SIZE,
      type: "crop",
    });
  }

  const columns: ColumnDef<any>[] = useMemo(() => [
    { header: "Product ID", accessorKey: "product_id" },
    {
      header: "Product",
      accessorKey: "name",
      cell: (_row) => {
        const row = _row.row.original;
        return (
          <div>
            <p className="font-medium">{row?.name || "N/A"}</p>
            <p className="text-xs capitalize text-muted-foreground">{row?.type || "N/A"}</p>
          </div>
        );
      },
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (_row) => _row.row.original?.category?.name || "N/A",
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (_row) => {
        const row = _row.row.original;
        const productId = String(row?.id);

        return (
          <PriceInputCell
            productId={productId}
            currentPrice={row?.price}
            onPriceChange={handlePriceChange}
            resetKey={resetKey}
          />
        );
      },
    },
  ], [handlePriceChange, resetKey]);

  return (
    <div className="mt-3">
      <CustomTable
        searchFilter={
          <div className="px-5 pt-5 py-2">
            <div className="space-y-5 rounded-xl border p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                <div className="md:col-span-5">
                  <div className="relative">
                    <Search className="absolute mt-2 mx-2 text-[#4A8D34]" />
                    <Input
                      className="px-10"
                      placeholder="Search product name or ID"
                      value={searchValues.query}
                      onChange={(event) => setSearchValues((prev) => ({ ...prev, query: event.target.value }))}
                    />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <Select
                    value={searchValues.category}
                    onValueChange={(value) => setSearchValues((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {(categoriesData?.results || []).map((item: any) => (
                        <SelectItem key={item?.id} value={String(item?.id)}>
                          {item?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-4">
                  <div className="flex justify-end gap-2">
                    <Button type="button" className="border" variant="ghost" onClick={handleReset}>
                      Reset
                    </Button>
                    <Button type="button" onClick={handleSearch}>
                      <LoadingLabel isLoading={isLoading}>
                        <Search className="me-1" /> Search
                      </LoadingLabel>
                    </Button>
                  </div>
                </div>
                <div className="md:col-span-12">
                  <Button type="button" className="w-full" onClick={handleUpdatePrices} disabled={isPending}>
                    <LoadingLabel isLoading={isPending}>
                      <Save className="me-1" /> Update Prices
                    </LoadingLabel>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
        columns={columns}
        data={data?.results || []}
        setPerPage={(pageSize) => setFilters((prev) => ({ ...prev, page_size: pageSize }))}
        perPage={filters.page_size}
        isLoading={isLoading}
        currentPage={filters.page}
        count={data?.pagination?.total || 0}
        handlePaginationChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        pagination={data?.pagination as IPagination}
      />
    </div>
  );
}

function PriceHistoryPanel() {
  const [filters, setFilters] = useState<PriceHistoryFilters>({
    page: 1,
    page_size: PAGE_SIZE,
  });
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedCurrency, setSelectedCurrency] = useState("all");

  const { data: productsData } = useFarmManagementProductList({
    queryParams: {
      page: 1,
      page_size: 100,
    },
  });

  const { data, isLoading } = usePriceHistory({
    queryParams: filters,
  });

  const productMap = useMemo(() => {
    return ((productsData?.results || []) as any[]).reduce<Record<string, string>>((acc, product) => {
      acc[String(product?.id)] = product?.name || product?.product_id || String(product?.id);
      return acc;
    }, {});
  }, [productsData?.results]);

  function applyFilters(product: string, currency: string) {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      product: product === "all" ? undefined : product,
      currency: currency === "all" ? undefined : currency,
    }));
  }

  const columns: ColumnDef<any>[] = [
    {
      header: "Product",
      accessorKey: "product",
      cell: (_row) => {
        const product = _row.row.original?.product;
        const productId = typeof product === "object" ? product?.id : product;
        return product?.name || productMap[String(productId)] || productId || "N/A";
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
    {
      header: "Date",
      accessorKey: "created_at",
      cell: (_row) => {
        const date = _row.row.original?.created_at || _row.row.original?.date_created;
        return date ? formatDateReadable(date) : "N/A";
      },
    },
  ];

  return (
    <div className="mt-3">
      <CustomTable
        searchFilter={
          <div className="px-5 pt-5 py-2">
            <div className="rounded-xl border p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                <div className="md:col-span-5">
                  <Select
                    value={selectedProduct}
                    onValueChange={(value) => {
                      setSelectedProduct(value);
                      applyFilters(value, selectedCurrency);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      {(productsData?.results || []).map((item: any) => (
                        <SelectItem key={item?.id} value={String(item?.id)}>
                          {item?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-4">
                  <Select
                    value={selectedCurrency}
                    onValueChange={(value) => {
                      setSelectedCurrency(value);
                      applyFilters(selectedProduct, value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        }
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

export function PriceUpdateTab() {
  return <PriceUpdatePanel />;
}

export function PriceHistoryTab() {
  return <PriceHistoryPanel />;
}
