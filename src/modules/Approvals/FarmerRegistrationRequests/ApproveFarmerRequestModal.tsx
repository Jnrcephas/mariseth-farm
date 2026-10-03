"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TModal } from "@/lib/types";
import { FARMER_TYPE_LABEL, FARMER_TYPE_ROUTES, FarmerType } from "@/modules/FarmManagement/utils/farmerTypes";

export default function ApproveFarmerRequestModal({
  open,
  setOpen,
  defaultData,
}: TModal) {
  const router = useRouter();
  const [farmerType, setFarmerType] = useState<FarmerType>("lead");

  function handleContinue() {
    const requestId = defaultData?.id;
    const route = FARMER_TYPE_ROUTES[farmerType].add;

    router.push(`${route}?farmer_reg_request=${requestId}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Approve Farmer Registration Request</DialogTitle>
            <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)} />
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <Label>Select Farmer Type</Label>
          <RadioGroup
            value={farmerType}
            onValueChange={(value) => setFarmerType(value as FarmerType)}
            className="grid grid-cols-1 gap-3"
          >
            {(Object.keys(FARMER_TYPE_LABEL) as FarmerType[]).map((type) => (
              <div
                key={type}
                className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer"
                onClick={() => setFarmerType(type)}
              >
                <RadioGroupItem value={type} id={`${type}-farmer`} />
                <Label htmlFor={`${type}-farmer`}>{FARMER_TYPE_LABEL[type]}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleContinue}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
