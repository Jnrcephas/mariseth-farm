import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import ProfileUpdate from "./ProfileUpdate"
import ViewPermissions from "./ViewPermissions";
import ChangePassword from "./ChangePassword";

export default function ProfileSettings({defaultData, refetch}:{defaultData: any; refetch: () => void;}){
  return(
    <div className="pt-8 mt-5 pb-10">
        <Tabs defaultValue="1" className="w-full mx-auto">
            <TabsList className="grid w-[500px] grid-cols-3 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
            <TabsTrigger className="h-[28px] cursor-pointer" value="1">Profile Info</TabsTrigger>
            <TabsTrigger className="h-[28px] cursor-pointer" value="2">Role Permissions</TabsTrigger>
            <TabsTrigger className="h-[28px] cursor-pointer" value="3">Change Password</TabsTrigger>
            </TabsList>
            <TabsContent value="1">
                <ProfileUpdate defaultData={defaultData} refetch={refetch}/>
            </TabsContent>
            <TabsContent value="2">
                <ViewPermissions defaultData={defaultData}/>
            </TabsContent>
            <TabsContent value="3">
                <ChangePassword/>
            </TabsContent>
        </Tabs>
    </div>)
}