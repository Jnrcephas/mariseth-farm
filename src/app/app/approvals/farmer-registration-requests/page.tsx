import PageTitle from "@/components/layouts/PageTitle";
import FarmerRegistrationRequests from "@/modules/Approvals/FarmerRegistrationRequests";

export default function Page() {
  return (
    <div>
      <PageTitle title="Farmer Registration Requests" />
      <FarmerRegistrationRequests />
    </div>
  );
}
