import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cleanJsonData } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { TSearchProps } from "@/lib/types";
import { LoadingLabel } from "@/components/ui/label";
import { PAGE_SIZE } from "@/lib/constants";
import { Search } from "lucide-react";

const loginLogoutSearchSchema = z.object({
  type: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

const TYPE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Login", value: "LOGIN" },
  { label: "Logout", value: "LOGOUT" },
];

export default function LoginLogoutAuditSearch({ setFilters, filters, isLoading }: TSearchProps) {
  const form = useForm<z.infer<typeof loginLogoutSearchSchema>>({
    resolver: zodResolver(loginLogoutSearchSchema),
    defaultValues: {
      type: filters?.type || "all",
      start_date: filters?.start_date || "",
      end_date: filters?.end_date || "",
    },
  });

  function onSubmit(values: z.infer<typeof loginLogoutSearchSchema>) {
    const queryParams = cleanJsonData({
      ...values,
      type: values.type === "all" ? "" : values.type,
    });
    setFilters((prev: any) => ({ ...prev, ...queryParams, page: 1 }));
  }

  function handleReset() {
    form.reset({ type: "all", start_date: "", end_date: "" });
    setFilters({ page: 1, page_size: PAGE_SIZE });
  }

  return (
    <div className="px-5 pt-5 py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 border rounded-xl p-5">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TYPE_OPTIONS.map((item) => (
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
            <div className="col-span-6 md:col-span-2">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date From</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" max={new Date().toISOString().split("T")[0]} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date To</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" min={form.watch("start_date")} max={new Date().toISOString().split("T")[0]} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 md:col-span-6 mt-5">
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
