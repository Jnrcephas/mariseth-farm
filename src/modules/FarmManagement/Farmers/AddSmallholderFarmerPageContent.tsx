"use client";

import { useFarmerRegistrationRequestRead } from "@/apis/farmerRequestApi";
import { Loader } from "lucide-react";
import AddSmallholderFarmer from "./AddSmallholderFarmer";

export default function AddSmallholderFarmerPageContent({
  farmerRegRequestId,
}: {
  farmerRegRequestId?: number;
}) {
  const hasRegRequest = Boolean(farmerRegRequestId);

  const { data, isFetching } = useFarmerRegistrationRequestRead(
    {
      pathParams: { id: Number(farmerRegRequestId) },
    },
    { enabled: hasRegRequest },
  );

  const isLoadingRegRequest = hasRegRequest && isFetching;

  return (
    <div className="bg-[#fff] rounded-lg h-full">
      {isLoadingRegRequest && (
        <div className="flex items-center gap-2 px-5 pt-4 text-sm text-muted-foreground">
          <Loader className="h-4 w-4 animate-spin" />
          Loading pre-filled request data...
        </div>
      )}
      <AddSmallholderFarmer defaultData={data || {}} farmerRegRequestId={farmerRegRequestId} />
    </div>
  );
}
