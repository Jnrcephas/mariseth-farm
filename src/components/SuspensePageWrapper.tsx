import { ReactNode } from "react";
import { SuspenseLogo } from "./SuspenseLoader";

export default function SuspensePageWrapper({isLoading, children}:{isLoading: boolean; skeleton?: ReactNode; children: ReactNode}){
    return(
        <div>
            {isLoading ?
                <div className="bg-[#fff] rounded-lg h-[80vh]">
                    <div className="flex justify-center items-center h-full w-full">
                        <SuspenseLogo/>
                    </div>
                </div>
                :
                <div>
                    {children}
                </div>
            }
        </div>
    )
}