"use client";
import { useState } from "react"
import { CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useHasAccess } from "@/hooks/auth/useHasAccess"
import CreditTable from "./CreditTable";
import PaybackTable from "./PaybackTable";

type CreditTab = "credit" | "payback"

const CREDIT_TABS: { key: CreditTab; label: string }[] = [
  { key: "credit", label: "Credit" },
  { key: "payback", label: "Payback" },
]

export default function CreditManagement() {
  const { hasAccess: create_credit } = useHasAccess("credit|create_credit")
  const [activeTab, setActiveTab] = useState<CreditTab>("credit")
  const [addCreditModal, setAddCreditModal] = useState(false)

  return (
    <div>
        <div className="font-bold text-xl text-black mb-4">
            Credit Management
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
                {CREDIT_TABS.map((tab) => (
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

            {create_credit && (
                <Button
                    className="bg-[#4A8D34] hover:bg-[#3f7a2c] text-white cursor-pointer rounded-sm px-6 py-4 text-base font-bold"
                    onClick={() => setAddCreditModal(true)}
                >
                    <CirclePlus/>
                    Record New Credit
                </Button>
            )}
        </div>

        {activeTab === "credit"
            ? <CreditTable addCreditModal={addCreditModal} setAddCreditModal={setAddCreditModal} />
            : <PaybackTable/>
        }
    </div>
  );
}