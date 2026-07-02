"use client";

import { useFarmerRegistrationRequestRead } from "@/apis/farmerRequestApi";
import { SuspenseLogo } from "@/components/SuspenseLoader";
import AddSmallholderFarmer from "./AddSmallholderFarmer";

export default function AddSmallholderFarmerPageContent({
  farmerRegRequestId,
}: {
  farmerRegRequestId?: number;
}) {
  const { data, isPending } = useFarmerRegistrationRequestRead(
    {
      pathParams: { id: Number(farmerRegRequestId) },
    },
    { enabled: Boolean(farmerRegRequestId) },
  );

  if (isPending) {
    return (
      <div className="bg-[#fff] rounded-lg h-[80vh]">
        <div className="flex justify-center items-center h-full w-full">
          <SuspenseLogo />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fff] rounded-lg h-full">
      <AddSmallholderFarmer defaultData={data || {}} farmerRegRequestId={farmerRegRequestId} />
    </div>
  );
}
