"use client"
import Categories from "./Categories"
import { CategoryTypes } from "./utils/constants"
import { capitalize } from "@/lib/helpers"
// import PageTitle from "@/components/layouts/PageTitle"
import { useState } from "react"
import { Tags } from "lucide-react"

export default function SystemSettings(){
    const [active, setActive] = useState(CategoryTypes[0])

    return(
        <div>
            {/* <PageTitle title="System Settings" /> */}
            <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full md:w-[260px] shrink-0 bg-white rounded-xl border border-[#E2E8F0] p-3 h-fit">
                    <div className="flex flex-col gap-1">
                        {CategoryTypes.map((item, idx) => {
                            const isActive = active === item
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActive(item)}
                                    className={`flex items-center gap-2 w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                                        isActive
                                            ? "bg-[#0B3D19] text-white"
                                            : "text-[#475569] hover:bg-[#F1F5F9]"
                                    }`}
                                >
                                    <Tags className="h-4 w-4 shrink-0" />
                                    {capitalize(item?.replaceAll("_", " "))}
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className="flex-grow">
                    <Categories category={active}/>
                </div>
            </div>
        </div>
    )
}