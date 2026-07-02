import PageTitle from "@/components/layouts/PageTitle";
import AddLeadFarmerPageContent from "@/modules/FarmManagement/Farmers/AddLeadFarmerPageContent";

export default async function Page({searchParams}: {searchParams: Promise<{farmer_reg_request?: string}>}){
    const params = await searchParams;
    const farmerRegRequest = params?.farmer_reg_request;
    const farmerRegRequestId = farmerRegRequest ? Number(farmerRegRequest) : undefined;

    return(
        <div>
            <PageTitle title="Add Lead Farmer" />
            <AddLeadFarmerPageContent farmerRegRequestId={farmerRegRequestId}/>
        </div>
    )
}
