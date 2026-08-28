"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useFarmerProfileUpdateRequestRead } from "@/apis/farmerRequestApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextLabel } from "@/components/ui/label";
import { routeTo } from "@/lib/constants";
import { formatDateReadable, formatText } from "@/lib/helpers";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";

function getUserName(user: any) {
  if (!user) {
    return "N/A";
  }

  return `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.email || "N/A";
}

function getUpdateValues(request: any) {
  const oldValue = request?.old_value ?? request?.current_value ?? request?.previous_value;
  const newValue = request?.value ?? request?.new_value;

  return {
    oldValue: oldValue || "N/A",
    newValue: newValue || "N/A",
  };
}

export default function FarmerProfileUpdateRequestDetails({ id }: { id: number }) {
  const { data, isLoading } = useFarmerProfileUpdateRequestRead({
    pathParams: { id },
  });
  const request = data as any;
  const status = request?.status || "pending";
  const { oldValue, newValue } = getUpdateValues(request);

  return (
    <div className="bg-white rounded-lg p-5">
      <Link href={routeTo.farmerRegistrationRequests}>
        <Button variant="outline" className="cursor-pointer mb-5">
          <ArrowLeft className="text-[#16A34A]" /> Back
        </Button>
      </Link>

      {isLoading ? (
        <div className="py-10 text-center">Loading...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <TextLabel title="Request ID" subTitle={request?.id || "N/A"} variant="primary" />
              <hr className="mt-2" />
            </div>
            <div>
              <TextLabel
                title="Status"
                subTitle={
                  <Badge variant={statusBadgeMap[String(status).toLowerCase()] || "warning"} className="capitalize">
                    {String(status).replace("_", " ")}
                  </Badge>
                }
                variant="primary"
              />
              <hr className="mt-2" />
            </div>
            <div>
              <TextLabel title="Phone Number" subTitle={request?.phone_number || "N/A"} variant="primary" />
              <hr className="mt-2" />
            </div>
            <div>
              <TextLabel title="Request Channel" subTitle={request?.request_channel || "N/A"} variant="primary" />
              <hr className="mt-2" />
            </div>
            <div>
              <TextLabel title="Requested At" subTitle={request?.created_at ? formatDateReadable(request.created_at) : "N/A"} variant="primary" />
              <hr className="mt-2" />
            </div>
            <div>
              <TextLabel title="Reviewed At" subTitle={request?.reviewed_at ? formatDateReadable(request.reviewed_at) : "N/A"} variant="primary" />
              <hr className="mt-2" />
            </div>
            <div>
              <TextLabel title="Created By" subTitle={getUserName(request?.created_by)} variant="primary" />
              <hr className="mt-2" />
            </div>
            <div>
              <TextLabel title="Reviewed By" subTitle={getUserName(request?.reviewed_by)} variant="primary" />
              <hr className="mt-2" />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <p className="mb-3 text-sm font-medium text-slate-900">Requested Change</p>
            <div className="mb-4">
              <span className="inline-flex rounded-full bg-[#E8F3E4] px-2 py-0.5 text-xs font-semibold capitalize text-[#2F6B1F]">
                {formatText(request?.update_value || "N/A")}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_32px_minmax(0,1fr)] md:items-center">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Current Value</p>
                <p className="min-h-10 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {oldValue}
                </p>
              </div>
              <div className="hidden h-8 items-center justify-center rounded-full bg-[#F1F8EE] md:flex">
                <ArrowRight className="h-4 w-4 text-[#4A8D34]" />
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Requested Value</p>
                <p className="min-h-10 rounded-md bg-[#F1F8EE] px-3 py-2 text-sm font-medium text-[#2F6B1F]">
                  {newValue}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <TextLabel title="Reason" subTitle={request?.reason || "N/A"} variant="primary" />
              <hr className="mt-2" />
            </div>
            <div>
              <TextLabel title="Comments" subTitle={request?.comments || "N/A"} variant="primary" />
              <hr className="mt-2" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
