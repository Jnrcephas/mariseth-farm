"use client";
import DropdownButton from "@/components/customs/ButtonDropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import AddCropModal from "./Modals/AddCropModal";
import CropsView from "./Crops";
import OtherProductsView from "./OtherProducts";
import AddOtherProductsModal from "./Modals/AddOtherProducts";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import { useHasAccess } from "@/hooks/auth/useHasAccess";

export default function Products() {
    const {hasAccess: create_product} = useHasAccess("product|create_product")

    const [open, setOpen] = useState(false)
    const [addNewCropModal, setAddNewCropModal] = useState(false)
    const [addOtherProductsModal, setAddOtherProductsModal] = useState(false)

    function handleAddNewCrop(){
        setOpen(false)
        setAddNewCropModal(true)
    }
    function handleAddOtherProducts(){
        setOpen(false)
        setAddOtherProductsModal(true)
    }
    
  return (
    <AuthorizeAndRenderPage permission={"product|list_products"}>
        <div className="flex justify-between">
            <div className="font-semibold text-black mb-10">
                Products
            </div>
            {create_product &&
                <DropdownButton 
                    open={open} 
                    setOpen={setOpen} 
                    title="Add New Product" 
                    icon={<CirclePlus/>}
                    menuItems={[
                        <DropdownMenuItem key="new-crop" onClick={handleAddNewCrop} className="py-3 px-6 text-gray-700 text-sm font-normal hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">
                            New Crop
                        </DropdownMenuItem>,
                        <DropdownMenuItem key="other-products" onClick={handleAddOtherProducts} className="py-3 px-6 text-gray-700 font-normal text-sm hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">
                            Other Products
                        </DropdownMenuItem>
                    ]}
                />
            }
        </div>
        <Tabs defaultValue="1" className="w-full mx-auto">
            <TabsList className="grid w-[400px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
                <TabsTrigger className="h-[28px] cursor-pointer" value="1">Crops</TabsTrigger>
                <TabsTrigger className="h-[28px] cursor-pointer" value="2">Other Products</TabsTrigger>
            </TabsList>
            <TabsContent value="1">
                <CropsView/>
            </TabsContent>
            <TabsContent value="2">
                <OtherProductsView/>
            </TabsContent>
        </Tabs>
        {addNewCropModal &&
            <AddCropModal
                open={addNewCropModal} 
                setOpen={setAddNewCropModal}
            />
        }
        {addOtherProductsModal &&
            <AddOtherProductsModal
                open={addOtherProductsModal} 
                setOpen={setAddOtherProductsModal}
            />
        }

    </AuthorizeAndRenderPage>
  );
}