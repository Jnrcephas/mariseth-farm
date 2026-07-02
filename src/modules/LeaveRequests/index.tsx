import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaveRequests from "./LeaveRequests";

export default function ViewLeaveRequests(){
    return(
        <div className="mt-5">
            <Tabs defaultValue="1" className="w-full mx-auto">
                <TabsList className="grid w-[450px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
                <TabsTrigger className="h-[28px] cursor-pointer" value="1">Pending Leave Requests</TabsTrigger>
                <TabsTrigger className="h-[28px] cursor-pointer" value="2">Approved Leave Requests</TabsTrigger>
                </TabsList>
                <TabsContent value="1">
                    <LeaveRequests pending={true} />
                </TabsContent>
                <TabsContent value="2">
                    <LeaveRequests pending={false}/>
                </TabsContent>
            </Tabs>
        </div>
    )
}