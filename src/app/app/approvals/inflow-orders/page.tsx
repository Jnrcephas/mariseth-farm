import InflowApprovals from "@/modules/Approvals/Inflow/Index";

export default function Page(){
    return(
        <div>
             <div className="flex justify-between">
                <div className="font-semibold text-black mb-10">
                    Inbound Orders
                </div>
            </div>
            <InflowApprovals/>
        </div>
    )
}