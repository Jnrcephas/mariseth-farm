import PageTitle from "@/components/layouts/PageTitle";
import FarmerRegistrationRequests from "@/modules/Approvals/FarmerRegistrationRequests";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { APPROVALS_TABS } from "@/lib/actionTabs";

export default function Page() {
  return (
    <div>
      <QuickActionTabs tabs={APPROVALS_TABS} />
      <PageTitle title="Farmer Registration Requests" />
      <FarmerRegistrationRequests />
    </div>
  );
}
