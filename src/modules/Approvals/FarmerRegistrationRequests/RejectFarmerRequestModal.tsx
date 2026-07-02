"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { useRejectFarmerRegistrationRequest } from "@/apis/farmerRequestApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingLabel } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMap } from "@/lib/helpers";
import { TModal } from "@/lib/types";
import { toast } from "sonner";

const rejectSchema = z.object({
  comments: z.string().min(1, "Comment is required"),
});

export default function RejectFarmerRequestModal({
  open,
  setOpen,
  defaultData,
  refetch,
}: TModal) {
  const form = useForm<z.infer<typeof rejectSchema>>({
    resolver: zodResolver(rejectSchema),
    defaultValues: {
      comments: "",
    },
  });

  const { mutate, isPending } = useRejectFarmerRegistrationRequest({
    onSuccess: () => {
      toast.success("Farmer registration request rejected successfully");
      refetch?.();
      setOpen(false);
    },
    onError: (errors: any) => {
      toast.error(getErrorMap(errors));
    },
  });

  function onSubmit(values: z.infer<typeof rejectSchema>) {
    mutate({
      pathParams: {
        id: Number(defaultData?.id),
      },
      body: values,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Reject Farmer Registration Request</DialogTitle>
            <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)} />
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter rejection comment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                <LoadingLabel isLoading={isPending}>Reject Request</LoadingLabel>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
