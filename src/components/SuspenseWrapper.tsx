import { ReactNode } from "react";
import { SuspenseLogo } from "./SuspenseLoader";

export default function SuspenseWrapper({isLoading, skeleton, children}:{isLoading: boolean; skeleton?: ReactNode; children: ReactNode}){
    return(
        <div>
            {isLoading ?
                <>
                    {skeleton ??
                        <div className="bg-[#fff] rounded-lg h-[60vh]">
                            <div className="flex justify-center items-center h-full w-full">
                                <SuspenseLogo/>
                            </div>
                        </div>
                    }
                </>
                :
                <div>
                    {children}
                </div>
            }
        </div>
    )
}