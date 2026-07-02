"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import Link from "next/link";
import { routeTo } from "@/lib/constants";
import TrainingUpcomingEvents from "./TrainingUpcomingEvents";
import TrainingPastEvents from "./TrainingPastEvents";

export default function ViewTrainings(){
    const {hasAccess: create_training} = useHasAccess("training|create_training")

    return(
        <div>
            <div className="flex justify-between items-center mb-5">
                    <div className="font-semibold text-black ">
                        Training
                    </div>
                    {create_training && 
                        <Link href={routeTo.trainingCreate}>
                            <Button className=""><CirclePlus/> Add New Training</Button>
                        </Link>
                    }
                </div>
            <div className="mt-5">
                <Tabs defaultValue="1" className="w-full mx-auto">
                    <TabsList className="grid w-[450px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
                    <TabsTrigger className="h-[28px] cursor-pointer" value="1">Upcoming</TabsTrigger>
                    <TabsTrigger className="h-[28px] cursor-pointer" value="2">Past</TabsTrigger>
                    </TabsList>
                    <TabsContent value="1">
                        <TrainingUpcomingEvents status={"upcoming"} />
                    </TabsContent>
                    <TabsContent value="2">
                        <TrainingPastEvents status={"completed"}/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}