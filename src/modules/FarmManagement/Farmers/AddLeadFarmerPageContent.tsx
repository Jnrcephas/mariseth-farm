"use client";

import { useFarmerRegistrationRequestRead } from "@/apis/farmerRequestApi";
import { SuspenseLogo } from "@/components/SuspenseLoader";
import AddLeadFarmer from "./AddLeadFarmer";

export default function AddLeadFarmerPageContent({
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
      <AddLeadFarmer defaultData={data || {}} farmerRegRequestId={farmerRegRequestId} />
    </div>
  );
}
