import CustomersView from "@/modules/SupplyChainManagement/Customers";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { SUPPLY_CHAIN_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={SUPPLY_CHAIN_MANAGEMENT_TABS} />
            <CustomersView/>
        </div>
    )
}
