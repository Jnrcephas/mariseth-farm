import PageTitle from "@/components/layouts/PageTitle";
import FarmerProfileUpdateRequestDetails from "@/modules/Approvals/FarmerRegistrationRequests/FarmerProfileUpdateRequestDetails";
import FarmerRegistrationRequestDetails from "@/modules/Approvals/FarmerRegistrationRequests/FarmerRegistrationRequestDetails";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    type?: string;
  }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const { type } = await searchParams;
  const isProfileUpdateRequest = type === "profile-update";

  return (
    <div>
      <PageTitle title={isProfileUpdateRequest ? "Farmer Profile Update Request" : "Farmer Registration Request"} />
      {isProfileUpdateRequest ? (
        <FarmerProfileUpdateRequestDetails id={Number(id)} />
      ) : (
        <FarmerRegistrationRequestDetails id={Number(id)} />
      )}
    </div>
  );
}
