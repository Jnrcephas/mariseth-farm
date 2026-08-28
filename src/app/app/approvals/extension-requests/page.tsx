import PageTitle from "@/components/layouts/PageTitle";
import ExtensionRequests from "@/modules/Approvals/ExtensionRequests";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { APPROVALS_TABS } from "@/lib/actionTabs";

export default function Page() {
  return (
    <div>
      <QuickActionTabs tabs={APPROVALS_TABS} />
      <PageTitle title="Extension Requests" />
      <ExtensionRequests />
    </div>
  );
}
