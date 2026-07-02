import PageTitle from "@/components/layouts/PageTitle";
import MainAuditTrails from "@/modules/AuditTrails";

export default function Page(){
    return(
        <div>
            <PageTitle title="Audit Trails"/>
            <MainAuditTrails />
        </div>
    )
}