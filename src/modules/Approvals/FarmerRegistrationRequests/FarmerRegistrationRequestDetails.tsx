"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useFarmerRegistrationRequestRead } from "@/apis/farmerRequestApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextLabel } from "@/components/ui/label";
import { routeTo } from "@/lib/constants";
import { formatDateReadable } from "@/lib/helpers";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";

export default function FarmerRegistrationRequestDetails({ id }: { id: number }) {
  const { data, isLoading } = useFarmerRegistrationRequestRead({
    pathParams: { id },
  });
  const request = data as any;
  const status = request?.status || "pending";
  const reviewedBy = request?.reviewed_by
    ? `${request.reviewed_by?.first_name || ""} ${request.reviewed_by?.last_name || ""}`.trim() || request.reviewed_by?.email
    : "N/A";
  const genderMap = {
    m: "Male",
    f: "Female",
  } as Record<string, string>;

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
            <TextLabel title="First Name" subTitle={request?.first_name || "N/A"} variant="primary" />
            <hr className="mt-2" />
          </div>
          <div>
            <TextLabel title="Last Name" subTitle={request?.last_name || "N/A"} variant="primary" />
            <hr className="mt-2" />
          </div>
          <div>
            <TextLabel title="Phone Number" subTitle={request?.phone_number || "N/A"} variant="primary" />
            <hr className="mt-2" />
          </div>
          <div>
            <TextLabel title="Email" subTitle={request?.email || "N/A"} variant="primary" />
            <hr className="mt-2" />
          </div>
          <div>
            <TextLabel title="Gender" subTitle={genderMap[String(request?.gender).toLowerCase()] || request?.gender || "N/A"} variant="primary" />
            <hr className="mt-2" />
          </div>
          <div>
            <TextLabel title="Date of Birth" subTitle={request?.date_of_birth || "N/A"} variant="primary" />
            <hr className="mt-2" />
          </div>
          <div>
            <TextLabel title="ID Type" subTitle={request?.id_type || "N/A"} variant="primary" />
            <hr className="mt-2" />
          </div>
          <div>
            <TextLabel title="ID Number" subTitle={request?.id_number || "N/A"} variant="primary" />
            <hr className="mt-2" />
          </div>
          <div>
            <TextLabel title="Region" subTitle={request?.region?.name || "N/A"} variant="primary" />
            <hr className="mt-2" />
          </div>
          <div>
            <TextLabel title="District" subTitle={request?.district?.name || "N/A"} variant="primary" />
            <hr className="mt-2" />
          </div>
          <div>
            <TextLabel title="Country" subTitle={request?.country?.name || request?.country || "N/A"} variant="primary" />
            <hr className="mt-2" />
          </div>
          <div>
            <TextLabel title="Request Channel" subTitle={request?.request_channel || "N/A"} variant="primary" />
            <hr className="mt-2" />
          </div>
          <div>
            <TextLabel title="Reviewed At" subTitle={request?.reviewed_at ? formatDateReadable(request.reviewed_at) : "N/A"} variant="primary" />
            <hr className="mt-2" />
          </div>
          <div>
            <TextLabel title="Reviewed By" subTitle={reviewedBy} variant="primary" />
            <hr className="mt-2" />
          </div>
          {request?.comments && (
            <div className="md:col-span-2">
              <TextLabel title="Comments" subTitle={request.comments} variant="primary" />
              <hr className="mt-2" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
