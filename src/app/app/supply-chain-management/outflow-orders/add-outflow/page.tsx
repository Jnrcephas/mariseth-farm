import PageTitle from "@/components/layouts/PageTitle";
import AddOutflowForm from "@/modules/SupplyChainManagement/OutflowOrders/AddOutflow/AddOutflowForm";

export default function Page(){
    return(
        <div>
            <PageTitle title="Add New Outbound Order"/>
            <AddOutflowForm />
        </div>
    )
}