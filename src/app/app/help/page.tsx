"use client"
import { useState } from "react";
import HelpTable from "@/modules/Help";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import SupportModal from "@/components/layouts/SupportModal";
import { routeTo } from "@/lib/constants";
import { ActionTabConfig } from "@/lib/actionTabs";

export default function Page(){
    const [supportModal, setSupportModal] = useState(false)

    // Defined inline (rather than in lib/actionTabs.ts like the other hub
    // tab groups) because "Support" needs to open a modal owned by this
    // page's own state - it isn't a real route, so it can't be a static
    // href-based config.
    const tabs: ActionTabConfig[] = [
        { label: "Help", href: routeTo.help },
        { label: "Support", onClick: () => setSupportModal(true) },
    ]

    return(
        <div>
            <QuickActionTabs tabs={tabs} />
            <HelpTable />
            <SupportModal open={supportModal} setOpen={setSupportModal}/>
        </div>
    )
}