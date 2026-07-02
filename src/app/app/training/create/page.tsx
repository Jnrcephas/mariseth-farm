import PageTitle from "@/components/layouts/PageTitle";
import { Button } from "@/components/ui/button";
import { routeTo } from "@/lib/constants";
import { AddTraining } from "@/modules/Training/AddTraining";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page(){
    return(
        <div className="space-y-5">
            <Link href={routeTo.training} className="pb-5">
                <Button variant="outline" className="cursor-pointer">
                    <ArrowLeft className="text-[#16A34A]"/>Back
                </Button>
            </Link>
            <div className="max-w-5xl mx-auto bg-white p-5 rounded-lg">
                <PageTitle title="Add New Training" />
                <AddTraining />
            </div>
        </div>
    )
}