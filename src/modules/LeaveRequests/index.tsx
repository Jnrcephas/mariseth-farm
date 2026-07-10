import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaveRequests from "./LeaveRequests";
import PageTitle from "@/components/layouts/PageTitle";

export default function ViewLeaveRequests(){
    return(
        <div className="mt-5">
            <PageTitle title="Leave Requests" />
            <Tabs defaultValue="1" className="w-full mx-auto">
                <TabsList className="grid w-full sm:w-[450px] grid-cols-2 h-auto p-1 bg-[#E2E8F0] rounded-full mb-5">
                    <TabsTrigger
                        className="h-[38px] rounded-full cursor-pointer font-semibold data-[state=active]:bg-[#0B3D19] data-[state=active]:text-white"
                        value="1"
                    >
                        Pending Leave Requests
                    </TabsTrigger>
                    <TabsTrigger
                        className="h-[38px] rounded-full cursor-pointer font-semibold data-[state=active]:bg-[#0B3D19] data-[state=active]:text-white"
                        value="2"
                    >
                        Approved Leave Requests
                    </TabsTrigger>
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