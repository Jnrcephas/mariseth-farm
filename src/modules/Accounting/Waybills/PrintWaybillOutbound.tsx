import { boolToYesNo, commaSeparator, formatDateReadable } from "@/lib/helpers";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";

export default function PrintWaybillOutbound({data}:{data: any}){
    const printRef = useRef<HTMLDivElement | null>(null);
    const {hasAccess: download_waybill} = useHasAccess("accounting|download_waybill")

  const handlePrint = () => {
    const printContents = printRef.current ? printRef.current.innerHTML : "";
    const originalContents = document.body.innerHTML;
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.boxSizing = "border-box";
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page {
          size: A4 portrait;
          margin: 0;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload to restore app state
  };
    return(
    <AuthorizeAndRenderPage permission={"accounting|view_waybill"}>
        <div className="flex justify-between p-5">
            <Button variant="outline" className="cursor-pointer" onClick={() => window.history.back()}>
                <ArrowLeft className="text-[#16A34A]"/>Back
            </Button>
            {download_waybill &&
                <Button className="" onClick={handlePrint}><Printer/> Print Waybill</Button>
            }
        </div>
        <div className=" p-8" id={"print-view"} ref={printRef}>
            <div className="max-w-5xl mx-auto bg-white p-5 px-8 shadow-sms border border-gray-200 relative">
                <div className="bg-white p-5  border-gray-200">
                <div className="flex items-center space-x-4 max-w-md">
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                    <div className="relative w-20 h-20">
                        {/* Logo Container */}
                        <div className="w-full h-full flex items-center justify-center">
                        {/* Leaf Icon */}
                        {/* <DefaultLogo /> */}
                        <Image src="/images/meriseth-logo.svg" alt="Logo" width={1000} height={1000} className="w-[120px] h-[120px]" />
                        
                        </div>
                    </div>         
                    </div>

                    {/* Company Information */}
                    <div className="flex-1 space-y-1">
                    <h1 className="text-xl font-bold text-gray-800 mb-2">
                        Mariseth Farms
                    </h1>
                    
                    <div className="space-y-0.5 text-gray-600">
                        <p className="text-sm">
                        Nii John Tetteh Street, Teiman,
                        </p>
                        <p className="text-sm">
                        Greater Accra-Ghana.
                        </p>
                    </div>
                    
                    <div className="space-y-0.5 pt-1 text-gray-600">
                        <p className="text-sm  ">
                        +(233) 26 778 6212.
                        </p>
                        <p className="text-sm">
                        <div className="">
                            info@marisethfarms.com
                        </div>
                        </p>
                    </div>
                    </div>
                </div>
                </div>
                <hr className="border border-2 border-[#000000]"/>
                <div className="grid grid-cols-12 mt-8 mb-5">
                    <div className="col-span-4">
                        <h2 className="font-semibold uppercase mb-2">OUTBOUND WAYBILL N0: </h2>
                        <div className=" uppercase mb-2 text-gray-600 text-sm">DATE ISSUED: </div>
                    </div>
                    <div className="col-span-8 text-gray-600">
                        <div className="mb-2">{data?.waybill_id}</div>
                        
                        <div className="text-sm">{formatDateReadable(data?.expected_delivery_date)}</div>
                    </div>

                </div>

                <div className="grid grid-cols-2 gap-0 my-6s  border-t border-[#000000]">
                <div className="border-r border-b border-[#000000] pb-5">
                    <h2 className="font-semibold uppercase mb-2 mt-5">RECIPIENT Details</h2>
                    <div className="text-gray-600 text-sm uppercase space-y-2">
                        <p className="grid grid-cols-2 gap-8"><span className="font-normal ">Customer Name:</span> {data?.customer?.name} ({data?.customer?.company})</p>
                        <p className="grid grid-cols-2 gap-8"><span className="font-normal">Customer Number:</span> {data?.customer?.phone_number}</p>
                        <p className="grid grid-cols-2 gap-8"><span className="font-normal">Destination Address:</span> {data?.customer?.location} </p>
                        <p className="grid grid-cols-2 gap-8"><span className="font-normal">Extra Comments:</span> {data?.customer?.comments}</p>
                    </div>
                </div>
                <div className="border-b px-5 border-[#000000] pb-5">
                    <h2 className="font-semibold uppercase mb-2 mt-5">Delivery Information</h2>
                    <div className="text-gray-600 text-sm uppercase space-y-2">
                        <p className="grid grid-cols-2 gap-8"><span className="font-normal">Driver Name:</span> {data?.delivery_information?.[0]?.driver_name}</p>
                        <p className="grid grid-cols-2 gap-8"><span className="font-normal">Driver License:</span> {data?.delivery_information?.[0]?.driver_license_number}</p>
                        <p className="grid grid-cols-2 gap-8"><span className="font-normal">Driver Phone Number:</span> {data?.delivery_information?.[0]?.driver_phone_number}</p>
                        <p className="grid grid-cols-2 gap-8"><span className="font-normal">Truck License Plate No.:</span> {data?.delivery_information?.[0]?.truck_license_number}</p>
                        <p className="grid grid-cols-2 gap-8"><span className="font-normal">Escort Required:</span> {boolToYesNo(data?.delivery_information?.[0]?.escort_required)}</p>
                        <p className="grid grid-cols-2 gap-8"><span className="font-normal">Escort Name:</span> {data?.delivery_information?.[0]?.escort_details}</p>
                    </div>
                </div>
                </div>

                <div className="overflow-x-auto border-b border-[#000000]">
                <table className="w-full table-auto border-collapse mb-4 text-sm ">
                    <thead>
                    <tr className="border-b border-[#000000] bg-white my-5 uppercase">
                        <th className="text-left py-2 px-2">Product ID</th>
                        <th className="text-left py-2 px-2">Product</th>
                        <th className="text-left py-2 px-2">Warehouse</th>
                        <th className="text-left py-2 px-2">Qty (Bags)</th>
                        <th className="text-left py-2 px-2">Weight</th>
                    </tr>
                    </thead>
                    <tbody className="text-grey-600">
                        {data?.products?.map((item: any, idx: number) => (
                            <tr className="border-bs text-grey-600" key={idx}>
                                <td className="py-5 px-2">{item?.product?.product_id}</td>
                                <td className="py-5 px-2">{item?.product?.name}</td>
                                <td className="py-5 px-2">{item?.warehouse?.name}</td>
                                <td className="py-5 px-2">{commaSeparator(item?.available_quantity)}</td>
                                <td className="py-5 px-2">{commaSeparator(item?.total_weight) || 0} KG</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>

                <div className="text-right font-normal mb-8 text-grey-600 mt-5">
                <span className="text-grey-600">Total Weight:</span> <span className="text-black font-medium">{commaSeparator(data?.total_weight || 0)} KG</span>
                </div>
                <div className="absolute1 bottom-0 relative w-full">
                    <div className="grid grid-cols-3 gap-4 text-center text-sm pt-8 w-full">
                    <div>
                        <div className="border-t border-gray-500 mt-4 w-full"></div>
                        <p className="mt-2">Authorizer Name</p>
                    </div>
                    <div>
                        <div className="border-t border-gray-500 mt-4 w-full"></div>
                        <p className="mt-2">Signature</p>
                    </div>
                    <div>
                        <div className="border-t border-gray-500 mt-4 w-full"></div>
                        <p className="mt-2">Date (DD/MM/YYYY)</p>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </AuthorizeAndRenderPage>)
}