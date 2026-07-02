import PageTitle from "@/components/layouts/PageTitle";
import MainDashboard from "@/modules/Dashboard/MainDashboard";

export default function Page(){
    return(
        <div>
            <PageTitle title="Dashboard"/>
            <MainDashboard />
        </div>
    )
}