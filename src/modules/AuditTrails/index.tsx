"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InflowAuditTrails from "./InflowAuditTrails";
import OutflowAuditTrails from "./OutflowAuditTrails";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";

export default function MainAuditTrails() {    
  return (
    <div>
        <Tabs defaultValue="1" className="w-full mx-auto">
            <TabsList className="grid w-[400px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
                <TabsTrigger className="h-[28px] cursor-pointer" value="1">Inbound Audit Trails</TabsTrigger>
                <TabsTrigger className="h-[28px] cursor-pointer" value="2">Outbound Audit Trials</TabsTrigger>
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