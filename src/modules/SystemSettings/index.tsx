import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Categories from "./Categories"
import { CategoryTypes } from "./utils/constants"
import { capitalize } from "@/lib/helpers"
export default function SystemSettings(){
    
    return(
        <div>
            <Tabs defaultValue="1" className="w-full flex flex-row" >
                <TabsList className="w-[250px] h-full bg-[#F1F5F9] border flex flex-col col-span-3">
                    {CategoryTypes.map((item, idx) => (
                        <TabsTrigger key={idx} className="cursor-pointer w-full py-3 font-bold" value={String(idx + 1)}>{capitalize(item?.replaceAll("_", " "))}</TabsTrigger>
                    ))}
                </TabsList>
                <div className="flex-grow border rounded-lg ">
                    {CategoryTypes.map((item, idx) => (
                        <TabsContent value={String(idx + 1)} key={idx}>
                            <Categories category={item}/>
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    )
}