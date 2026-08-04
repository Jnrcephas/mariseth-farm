"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { toast } from "sonner";
import { useReviewHarvestRequest } from "@/apis/harvestRequestApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingLabel } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMap } from "@/lib/helpers";
import { TModal } from "@/lib/types";

type ReviewAction = "approve" | "reject";

const reviewSchema = z.object({
  comment: z.string().optional(),
});

const rejectReviewSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
});

interface ReviewHarvestRequestModalProps extends TModal {
  action: ReviewAction;
}

export default function ReviewHarvestRequestModal({
  open,
  setOpen,
  defaultData,
  refetch,
  action,
}: ReviewHarvestRequestModalProps) {
  const isReject = action === "reject";

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(isReject ? rejectReviewSchema : reviewSchema),
    defaultValues: {
      comment: "",
    },
  });

  const { mutate, isPending } = useReviewHarvestRequest({
    onSuccess: () => {
      toast.success(`Harvest request ${isReject ? "rejected" : "approved"} successfully`);
      refetch?.();
      setOpen(false);
    },
    onError: (errors: any) => {
      toast.error(getErrorMap(errors));
    },
  });

  function onSubmit(values: z.infer<typeof reviewSchema>) {
    mutate({
      pathParams: { id: Number(defaultData?.id) },
      body: {
        review_action: action,
        comment: values.comment || "",
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{isReject ? "Reject" : "Approve"} Harvest Request</DialogTitle>
            <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)} />
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <p className="text-sm text-[#64748B]">
              {isReject
                ? `Are you sure you want to reject the harvest request for ${defaultData?.phone_number || "this farmer"}?`
                : `Are you sure you want to approve the harvest request for ${defaultData?.phone_number || "this farmer"}?`}
            </p>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment {!isReject && <span className="text-[#94A3B8]">(optional)</span>}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={isReject ? "Enter rejection comment" : "Enter a comment"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant={isReject ? "destructive" : "default"}>
                <LoadingLabel isLoading={isPending}>
                  {isReject ? "Reject Request" : "Approve Request"}
                </LoadingLabel>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
