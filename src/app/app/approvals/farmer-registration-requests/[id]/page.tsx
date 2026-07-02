import PageTitle from "@/components/layouts/PageTitle";
import { PageProps } from "@/lib/types";
import FarmerRegistrationRequestDetails from "@/modules/Approvals/FarmerRegistrationRequests/FarmerRegistrationRequestDetails";

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <PageTitle title="Farmer Registration Request" />
      <FarmerRegistrationRequestDetails id={Number(id)} />
    </div>
  );
}
