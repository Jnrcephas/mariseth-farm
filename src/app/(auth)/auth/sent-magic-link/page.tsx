import SentMagicLink from "@/modules/Auth/SentMagicLink";
import Image from "next/image";
export default function Page() {
  
  return (
      <div  className="border border-[#64748B0D] rounded-2xl bg-white  mt-10 !z-10">
        <div className="p-5">
            <div className="bg-[#F8FAFC] h-[213px] rounded-xl flex justify-center items-center">
                <Image
                    className="mx-auto w-[162px]"
                    src="/images/envelope.svg"
                    alt="meriseth logo"
                    width={500}
                    height={500}
                    priority
                />
            </div>
        </div>
        <div className="flex gap-4 items-center justify-center flex-col">
          <div className="text-centers px-5">
            <h1 className="font-semibold mb-3 text-[37px] md:text-xl">Magic link sent to your email</h1>
            <div className="text-sm text-slate-500">Thank you. If an account exist with your email address, you should receive an email address to reset your password.</div>
          </div>
        </div>
        <SentMagicLink/>
      </div>
    
  );
}
