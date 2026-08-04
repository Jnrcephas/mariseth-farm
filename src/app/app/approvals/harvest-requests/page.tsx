import PageTitle from "@/components/layouts/PageTitle";
import HarvestRequests from "@/modules/Approvals/HarvestRequests";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { APPROVALS_TABS } from "@/lib/actionTabs";

export default function Page() {
  return (
    <div>
      <QuickActionTabs tabs={APPROVALS_TABS} />
      <PageTitle title="Harvest Requests" />
      <HarvestRequests />
    </div>
  );
}
