import PageTitle from "@/components/layouts/PageTitle";
import SystemSettings from "@/modules/SystemSettings";

export default function Page(){
    return(
        <div>
            <PageTitle title="System Settings"/>
            <SystemSettings />
        </div>
    )
}