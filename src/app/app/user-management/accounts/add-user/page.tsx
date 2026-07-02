import PageTitle from "@/components/layouts/PageTitle";
import AddUser from "@/modules/UserManagement/UserAccounts/AddUser";

export default function Page(){
    return(
        <div>
            <PageTitle title="Add Admin User" />
            <div className="bg-[#fff] rounded-lg h-full">
                <AddUser />
            </div>
        </div>
    )
}