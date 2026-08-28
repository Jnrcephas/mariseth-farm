import PageTitle from "@/components/layouts/PageTitle";
import { PageProps } from "@/lib/types";
import FarmerProfileUpdateRequestDetails from "@/modules/Approvals/FarmerRegistrationRequests/FarmerProfileUpdateRequestDetails";

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <PageTitle title="Farmer Profile Update Request" />
      <FarmerProfileUpdateRequestDetails id={Number(id)} />
    </div>
  );
}
