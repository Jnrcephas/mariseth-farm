import CreatePasswordSuccess from "@/modules/Auth/CreatePasswordSuccess";
import Image from "next/image";
export default function Page() {
  
  return (
      <div  className="border border-[#64748B0D] rounded-2xl bg-white  mt-10 !z-10">
        <div className="p-5">
            <div className="bg-[#F8FAFC] h-[213px] rounded-xl flex justify-center items-center">
                <Image
                    className="mx-auto w-[352px]"
                    src="/images/shield-success.svg"
                    alt="meriseth logo"
                    width={500}
                    height={500}
                    priority
                />
            </div>
        </div>
        <div className="flex gap-4 items-center justify-center flex-col">
          <div className="text-centers px-5">
            <h1 className="font-semibold mb-3 text-[37px] md:text-xl">Password creation success</h1>
            <div className="text-sm text-slate-500">Create a new password for your Mesh account to secure your account.</div>
          </div>
        </div>
        <CreatePasswordSuccess/>
      </div>
    
  );
}
