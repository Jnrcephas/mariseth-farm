"use client"
import { useAccountsAuthMe} from "@/apis/adminApiComponents";
import { SuspenseLogo } from "@/components/SuspenseLoader";
import ProfileSettings from "@/modules/ProfileSettings/Index";

export default function Page(){
    const {data, isPending, refetch} = useAccountsAuthMe({})
    return(
        <div>
            {isPending ?
                <div className="bg-[#fff] rounded-lg h-[80vh]">
                    <div className="flex justify-center items-center h-full w-full">
                        <SuspenseLogo/>
                    </div>
                </div>:
                <div>
                    <div className="bg-[#fff] rounded-lg h-full">
                        <ProfileSettings defaultData={data as any} refetch={refetch}/>
                    </div>
                </div>
            }
        </div>
    )
}