"use client"
import { useTrainingRead } from "@/apis/adminApiComponents";
import PageTitle from "@/components/layouts/PageTitle";
import { SuspenseLogo } from "@/components/SuspenseLoader";
import { Button } from "@/components/ui/button";
import { routeTo } from "@/lib/constants";
import { PageProps } from "@/lib/types";
import ViewTraining from "@/modules/Training/ViewTraining";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function Page({ params }: PageProps){
    const { id } = use(params);
    const {data, isPending} = useTrainingRead({pathParams: {id: Number(id)}})
    return(
        <div>
            <Link href={routeTo.training} className="">
                <Button variant="outline" className="cursor-pointer">
                    <ArrowLeft className="text-[#16A34A]"/>Back
                </Button>
            </Link>
            {isPending ? 
                <div className="bg-[#fff] rounded-lg h-[80vh]">
                    <div className="flex justify-center items-center h-full w-full">
                        <SuspenseLogo/>
                    </div>
                </div>
                :<div className=" bg-white p-5 rounded-lg mt-5">
                    <PageTitle title={`View Training - ${data?.training_id}`} />
                    <ViewTraining  defaultData={data} />
                </div>
            }
        </div>
    )
}