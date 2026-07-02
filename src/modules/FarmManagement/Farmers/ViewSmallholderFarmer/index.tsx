"use client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import LeadFarmerPersonalInfo from "./PersonalInfo"
import LeadFarmerFarmInfo from "./FarmInfo"
import CreditHistory from "./CreditHistory"
import Link from "next/link"
import { routeTo } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import { useFarmManagementFarmRead } from "@/apis/adminApiComponents"
import { IFarmer } from "../../utils/types"
import SuspenseWrapper from "@/components/SuspenseWrapper"
import { AuthorizeAndRenderPage } from "@/components/Unauthorized"

export function ViewSmallholderFarmer({defaultData}:{defaultData: IFarmer}) {

  const { data, isPending } = useFarmManagementFarmRead({
        pathParams: {id: Number(defaultData?.farm?.id),
        }},{enabled: !!defaultData?.farm?.id})

  return (
    <AuthorizeAndRenderPage permission="farmer|view_farmer">
      <div>
        <div className="flex justify-between p-5">
          <Link href={routeTo.farmers}>
              <Button variant="outline" className="cursor-pointer">
                  <ArrowLeft className="text-[#16A34A]"/>Back
              </Button>
          </Link>
          <Link href={`${routeTo.editSmallholderFarmer}/${defaultData?.id}`}>
            <Button variant="outline" className="bg-[#4A8D34] border-[#4A8D34] text-white hover:text-[#4A8D34] cursor-pointer">
              <Edit/>  Edit
            </Button>
          </Link>
        </div>
        <Tabs defaultValue="1" className="w-full mx-auto">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
            <TabsTrigger className="h-[28px] cursor-pointer" value="1">Personal</TabsTrigger>
            <TabsTrigger className="h-[28px] cursor-pointer" value="2">Farm Information</TabsTrigger>
            <TabsTrigger className="h-[28px] cursor-pointer" value="3">Credit History</TabsTrigger>
          </TabsList>
          <TabsContent value="1" className="p-5">
            <LeadFarmerPersonalInfo defaultData={defaultData}/>
          </TabsContent>
          <TabsContent value="2" className="p-5">
            <SuspenseWrapper isLoading={isPending}>
                <LeadFarmerFarmInfo defaultData={{...data, farmer_id: defaultData?.id, support_assistance: defaultData?.support_assistance} as any}/>
              </SuspenseWrapper>
          </TabsContent>
          <TabsContent value="3" className="p-5">
            <AuthorizeAndRenderPage permission="farmer|get_farmer_credit_history">
              <CreditHistory farmerId={defaultData?.id}/>
            </AuthorizeAndRenderPage>
          </TabsContent>
        </Tabs>
      </div>
    </AuthorizeAndRenderPage>
  )
}
