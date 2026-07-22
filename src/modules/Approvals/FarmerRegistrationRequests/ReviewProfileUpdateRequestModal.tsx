"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useReviewFarmerProfileUpdateRequest } from "@/apis/farmerRequestApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingLabel } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMap } from "@/lib/helpers";

const reviewSchema = z.object({
  comment: z.string().optional(),
});

type ReviewAction = "approve" | "reject";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultData?: any;
  refetch?: () => void;
  action: ReviewAction;
};

export default function ReviewProfileUpdateRequestModal({
  open,
  setOpen,
  defaultData,
  refetch,
  action,
}: Props) {
  const isReject = action === "reject";
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(
      reviewSchema.superRefine((values, ctx) => {
        if (isReject && !values.comment?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Comment is required",
            path: ["comment"],
          });
        }
      }),
    ),
    defaultValues: {
      comment: "",
    },
  });

  const { mutate, isPending } = useReviewFarmerProfileUpdateRequest({
    onSuccess: () => {
      toast.success(`Profile update request ${isReject ? "rejected" : "approved"} successfully`);
      refetch?.();
      setOpen(false);
    },
    onError: (errors: any) => {
      toast.error(getErrorMap(errors));
    },
  });

  function onSubmit(values: z.infer<typeof reviewSchema>) {
    mutate({
      pathParams: {
        id: Number(defaultData?.id),
      },
      body: {
        review_action: action,
        comments: values.comment || "",
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{isReject ? "Reject" : "Approve"} Profile Update Request</DialogTitle>
            <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)} />
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {isReject ? (
              <FormField
                control={form.control}
                name="comment"
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
            ) : (
              <p className="text-sm text-muted-foreground">
                Approve this farmer profile update request?
              </p>
            )}
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
