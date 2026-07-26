"use client";
import DropdownButton from "@/components/customs/ButtonDropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import AddCropModal from "./Modals/AddCropModal";
import CropsView from "./Crops";
import OtherProductsView from "./OtherProducts";
import AddOtherProductsModal from "./Modals/AddOtherProducts";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { cn } from "@/lib/utils";

type ProductTab = "crops" | "other"

const PRODUCT_TABS: { key: ProductTab; label: string }[] = [
    { key: "crops", label: "Crops" },
    { key: "other", label: "Other Products" },
]

export default function Products() {
    const {hasAccess: create_product} = useHasAccess("product|create_product")

    const [open, setOpen] = useState(false)
    const [addNewCropModal, setAddNewCropModal] = useState(false)
    const [addOtherProductsModal, setAddOtherProductsModal] = useState(false)
    const [activeTab, setActiveTab] = useState<ProductTab>("crops")

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
        <div className="font-bold text-xl text-black mb-4">Products</div>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
                {PRODUCT_TABS.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                            "rounded-sm px-6 py-4 text-base font-bold transition-colors cursor-pointer",
                            activeTab === tab.key
                                ? "bg-[#4A8D34] text-white"
                                : "bg-[#E2E8F0] text-[#64748B] hover:bg-[#CBD5E1]"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
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

        {activeTab === "crops" ? <CropsView/> : <OtherProductsView/>}

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