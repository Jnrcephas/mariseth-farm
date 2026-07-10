"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InflowAuditTrails from "./InflowAuditTrails";
import OutflowAuditTrails from "./OutflowAuditTrails";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";

export default function MainAuditTrails() {    
  return (
    <div>
        <Tabs defaultValue="1" className="w-full mx-auto">
            <TabsList className="grid w-full sm:w-[420px] grid-cols-2 h-auto p-1 bg-[#E2E8F0] rounded-full mb-5">
                <TabsTrigger
                    className="h-[38px] rounded-full cursor-pointer font-semibold data-[state=active]:bg-[#0B3D19] data-[state=active]:text-white"
                    value="1"
                >
                    Inbound Audit Trails
                </TabsTrigger>
                <TabsTrigger
                    className="h-[38px] rounded-full cursor-pointer font-semibold data-[state=active]:bg-[#0B3D19] data-[state=active]:text-white"
                    value="2"
                >
                    Outbound Audit Trails
                </TabsTrigger>
            </TabsList>
            <TabsContent value="1">
                <AuthorizeAndRenderPage permission="audit_trail|list_inflow_history">
                    <InflowAuditTrails/>
                </AuthorizeAndRenderPage>
            </TabsContent>
            <TabsContent value="2">
                <AuthorizeAndRenderPage permission="audit_trail|list_inflow_history">
                    <OutflowAuditTrails/>
                </AuthorizeAndRenderPage>
            </TabsContent>
        </Tabs>
    </div>
  );
}