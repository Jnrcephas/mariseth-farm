"use client"
import { useAccountsUsersAdminRead} from "@/apis/adminApiComponents";
import PageTitle from "@/components/layouts/PageTitle";
import { SuspenseLogo } from "@/components/SuspenseLoader";
import { PageProps } from "@/lib/types";
import AddUser from "@/modules/UserManagement/UserAccounts/AddUser";
import { use } from "react";

export default function Page({ params }: PageProps){
    const { id } = use(params);
    const {data, isPending} = useAccountsUsersAdminRead({pathParams: {id: Number(id)}})
    return(
        <div>
            <PageTitle title="Edit Admin User" />
            {isPending ?
                <div className="bg-[#fff] rounded-lg h-[80vh]">
                    <div className="flex justify-center items-center h-full w-full">
                        <SuspenseLogo/>
                    </div>
                </div>:
                <div className="bg-[#fff] rounded-lg">
                    <AddUser defaultData={data} isEdit/>
                </div>
            }
        </div>
    )
}