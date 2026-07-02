import PageTitle from "@/components/layouts/PageTitle";
import AddSmallholderFarmerPageContent from "@/modules/FarmManagement/Farmers/AddSmallholderFarmerPageContent";

export default async function Page({searchParams}: {searchParams: Promise<{farmer_reg_request?: string}>}){
    const params = await searchParams;
    const farmerRegRequest = params?.farmer_reg_request;
    const farmerRegRequestId = farmerRegRequest ? Number(farmerRegRequest) : undefined;

    return(
        <div>
            <PageTitle title="Add Smallholder Farmer" />
            <AddSmallholderFarmerPageContent farmerRegRequestId={farmerRegRequestId}/>
        </div>
    )
}
