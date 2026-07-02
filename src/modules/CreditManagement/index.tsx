"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreditTable from "./CreditTable";
import PaybackTable from "./PaybackTable";

export default function CreditManagement() {

  return (
    <div>
        <div className="flex justify-between">
            <div className="font-semibold text-black mb-10">
                Credit Management
            </div>
        </div>
        <Tabs defaultValue="1" className="w-full mx-auto">
            <TabsList className="grid w-[400px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
                <TabsTrigger className="h-[28px] cursor-pointer" value="1">Credit</TabsTrigger>
                <TabsTrigger className="h-[28px] cursor-pointer" value="2">Payback</TabsTrigger>
            </TabsList>
            <TabsContent value="1" className="relative">
                <CreditTable/>
            </TabsContent>
            <TabsContent value="2">
                <PaybackTable/>
            </TabsContent>
        </Tabs>
        
    </div>
  );
}