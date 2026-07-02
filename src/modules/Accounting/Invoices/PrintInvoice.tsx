import { commaSeparator, formatDateReadable, percentage } from "@/lib/helpers";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { CEDI } from "@/lib/constants";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";

export default function PrintInvoice({data}:{data: any}){
    const printRef = useRef<HTMLDivElement | null>(null);
    const {hasAccess: download_invoice} = useHasAccess("accounting|download_invoice")    

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

  const getFund = percentage(5, data?.invoice?.total_cost)
  const covidLevy = percentage(1, data?.invoice?.total_cost)
  const vat = percentage(15, Number(data?.invoice?.total_cost) + Number(getFund) + Number(covidLevy))

  const total = Number(data?.invoice?.total_cost || 0) + Number(getFund) + Number(covidLevy) + Number(vat)
    return(
    <AuthorizeAndRenderPage permission={"accounting|view_invoice"}>
        <div className="flex justify-between p-5">
            <Button variant="outline" className="cursor-pointer" onClick={() => window.history.back()}>
                <ArrowLeft className="text-[#16A34A]"/>Back
            </Button>
            {download_invoice &&
                <Button className="" onClick={handlePrint}><Printer/> Print Invoice</Button>
            }
        </div>
        <div className=" p-8" id={"print-view"} ref={printRef}>
            <div className="max-w-5xl mx-auto bg-white p-5 px-8 shadow-sms border border-gray-200 relative rounded-lg">
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
                        <h2 className="font-semibold uppercase mb-2">INVOICE N0: </h2>
                        <div className=" uppercase mb-2 text-gray-600 text-sm">DATE ISSUED: </div>
                    </div>
                    <div className="col-span-8 text-gray-600">
                        <div className="mb-2">{data?.invoice?.invoice_id}</div>
                        
                        <div className="text-sm">{formatDateReadable(data?.invoice?.date_created)}</div>
                    </div>

                </div>

                <div className="grid grid-cols-2 gap-0 my-6s  border-t border-[#000000]">
                <div className="border-b border-[#000000] pb-5">
                    <h2 className="font-semibold uppercase mb-2 mt-5">Bill To</h2>
                    <div className="text-gray-600 text-sm uppercase space-y-2">
                        <p className="grid grid-cols-2 gap-8">{data?.invoice?.customer?.name}</p>
                    </div>
                </div>
                <div className="border-b px-5 border-[#000000] pb-5">
                    {/* <h2 className="font-semibold uppercase mb-2 mt-5">Payment</h2>
                    <div className="text-gray-600 text-sm uppercase space-y-2">
                        <p className="grid grid-cols-2 gap-3"><span className="font-normal">Amount:</span>  {CEDI} {data?.invoice?.amount_paid}</p>
                       
                    </div> */}
                </div>
                </div>

                <div className="overflow-x-auto border-b border-[#000000]">
                <table className="w-full table-auto border-collapse mb-4 text-sm ">
                    <thead>
                    <tr className="border-b border-[#000000] bg-white my-5">
                        <th className="text-left py-2 px-2">Product ID</th>
                        <th className="text-left py-2 px-2">Product</th>
                        <th className="text-left py-2 px-2">Unit Price</th>
                        <th className="text-left py-2 px-2">Qty (Bags)</th>
                        <th className="text-left py-2 px-2 !text-end">Amount</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {data?.outflow?.products?.map((item: any, idx: number) => (
                            <tr className="border-bs text-gray-600" key={idx}>
                                <td className="py-5 px-2 text-gray-600">{item?.product?.product_id}</td>
                                <td className="py-5 px-2 text-gray-600">{item?.product?.name}</td>
                                <td className="py-5 px-2 text-gray-600">{CEDI} {commaSeparator(item?.price_per_unit)}</td>
                                <td className="py-5 px-2 text-gray-600">{commaSeparator(item?.expected_quantity)}</td>
                                <td className="py-5 px-2 text-gray-600 text-end">{CEDI} {commaSeparator(item?.cost)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>

                
                <div className="flex justify-end font-normal mb-8 text-gray-600 mt-5">
                    <div className="flex flex-col gap-5">
                        <div className="flex gap-10 items-center flex justify-end">
                            <span className="text-gray-600 text-xs text-right">SUBTOTAL:</span> <span className="text-black font-medium text-right">{CEDI} {commaSeparator(data?.invoice?.total_cost)}</span>
                        </div>
                        
                        <div className="flex gap-10 items-center flex justify-end">
                            <span className="text-gray-600 text-xs text-right">GETFUND/NHIL (5%):</span> <span className="text-black font-medium text-right">{CEDI} {commaSeparator(getFund)}</span>
                        </div>
                        <div className="flex gap-10 items-center flex justify-end">
                            <span className="text-gray-600 text-xs text-right">COVID-19 LEVY (1%):</span> <span className="text-black font-medium text-right">{CEDI} {commaSeparator(covidLevy)}</span>
                        </div>
                         <div className="flex gap-10 items-center flex justify-end">
                            <span className="text-gray-600 text-xs text-right">VAT (15%):</span> <span className="text-black font-medium text-right">{CEDI} {commaSeparator(vat)}</span>
                        </div>
                        
                       
                        <div className="flex gap-10 items-center flex justify-end">
                            <span className="text-gray-600 text-xs text-right">TOTAL:</span> <span className="text-black font-medium text-right">{CEDI} {commaSeparator(total)}</span>
                        </div>
                        
                    </div>
                </div>
                <div className="absolute1 bottom-0 relative w-full">
                    <div className="grid grid-cols-3 gap-4 text-center text-sm pt-8 w-full">
                    <div>
                        <div className="border-t border-gray-500 mt-4 w-full"></div>
                        <p className="mt-2 text-gray-600">Authorizer Name</p>
                    </div>
                    <div>
                        <div className="border-t border-gray-500 mt-4 w-full"></div>
                        <p className="mt-2 text-gray-600">Signature</p>
                    </div>
                    <div>
                        <div className="border-t border-gray-500 mt-4 w-full"></div>
                        <p className="mt-2 text-gray-600">Date (DD/MM/YYYY)</p>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </AuthorizeAndRenderPage>)
}