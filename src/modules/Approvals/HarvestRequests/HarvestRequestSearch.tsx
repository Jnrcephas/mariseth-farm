"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingLabel } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PAGE_SIZE } from "@/lib/constants";
import { cleanJsonData } from "@/lib/helpers";
import { TSearchProps } from "@/lib/types";

const requestSearchSchema = z.object({
  query: z.string().optional(),
  status: z.string().optional(),
});

const HARVEST_REQUEST_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function HarvestRequestSearch({ setFilters, filters, isLoading }: TSearchProps) {
  const form = useForm<z.infer<typeof requestSearchSchema>>({
    resolver: zodResolver(requestSearchSchema),
    defaultValues: {
      query: filters?.query || "",
      status: filters?.status || "pending",
    },
  });

  useEffect(() => {
    form.reset({
      query: filters?.query || "",
      status: filters?.status || "pending",
    });
  }, [filters, form]);

  function onSubmit(values: z.infer<typeof requestSearchSchema>) {
    setFilters((prev: any) => ({
      ...prev,
      ...cleanJsonData(values),
      page: 1,
    }));
  }

  function handleReset() {
    form.reset({ query: "", status: "pending" });
    setFilters({ page: 1, page_size: PAGE_SIZE, status: "pending" });
  }

  return (
    <div className="px-5 pt-5 py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 border rounded-xl p-5">
          <div className="grid grid-cols-1">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute mt-2 mx-2 text-[#4A8D34]" />
                      <Input className="px-10" placeholder="Search with phone number or request ID" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {HARVEST_REQUEST_STATUS_OPTIONS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 md:col-span-6" />
            <div className="col-span-12 md:col-span-3 mt-5">
              <div className="flex justify-end gap-2">
                <Button type="button" className="border" variant="ghost" onClick={handleReset}>
                  Reset
                </Button>
                <Button type="submit">
                  <LoadingLabel isLoading={isLoading}>
                    <Search className="me-1" /> Search
                  </LoadingLabel>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
