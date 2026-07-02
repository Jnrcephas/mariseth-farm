"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function MetricsCard({data}:{data: any}) {

  return (
    <div className="w-full mx-auto">
      <Card className="bg-[#4A8D34] text-white rounded-lg overflow-hidden h-[162px] py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/50">
          <div className="px-6 flex flex-col items-start">
            <div className="bg-white rounded-full p-3 mb-3">
              <div className="h-4 w-4 text-green-600" >
                <Image
                    className="w-full"
                    src="/images/icons/banknote2.svg"
                    alt="meriseth logo"
                    width={500}
                    height={500}
                    priority
                />
            </div>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Lead Farmers</h3>
            <p className="text-xl font-bold mt-4">{data?.lead_farmers || 0}</p>
          </div>

          <div className="px-6 flex flex-col items-start">
            <div className="bg-white rounded-full p-3 mb-3">
                <div className="h-4 w-4 text-green-600" >
                    <Image
                        className="w-full"
                        src="/images/icons/history2.svg"
                        alt="meriseth logo"
                        width={500}
                        height={500}
                        priority
                    />
                </div>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Smallholder Farmers</h3>
            <p className="text-xl font-bold mt-4">{data?.smallholder_farmers || 0}</p>
          </div>

          <div className="px-6 flex flex-col items-start">
            <div className="bg-white rounded-full p-3 mb-3">
                <div className="h-4 w-4 text-green-600" >
                    <Image
                        className="w-full"
                        src="/images/icons/archive.svg"
                        alt="meriseth logo"
                        width={500}
                        height={500}
                        priority
                    />
                </div>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Active Warehouses</h3>
            <p className="text-xl font-bold mt-4">{data?.active_warehouses || 0}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
