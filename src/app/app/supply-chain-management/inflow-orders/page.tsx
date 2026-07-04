import MainSupplyChainInflow from "@/modules/SupplyChainManagement/InflowOrders";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { SUPPLY_CHAIN_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
           <QuickActionTabs tabs={SUPPLY_CHAIN_MANAGEMENT_TABS} />
           <MainSupplyChainInflow/>
        </div>
    )
}
