import PageTitle from "@/components/layouts/PageTitle";
import AddInflowForm from "@/modules/SupplyChainManagement/InflowOrders/AddInflow/AddInflowForm";

export default function Page(){
    return(
        <div>
            <PageTitle title="Add New Inbound Order"/>
            <AddInflowForm />
        </div>
    )
}