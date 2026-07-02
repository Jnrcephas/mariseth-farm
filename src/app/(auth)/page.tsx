import LoginForm from "@/modules/Auth/LoginForm";
import Image from "next/image";
export default function Page() {
  
  return (
      <div  className="border border-[#64748B0D] rounded-2xl bg-white py-8 mt-10 !z-10">
        <Image
          className="mx-auto w-[60px]"
          src="/images/meriseth-logo.svg"
          alt="meriseth logo"
          width={500}
          height={500}
          priority
        />
        <div className="flex gap-4 items-center justify-center flex-col mt-5">
          <div className="text-center">
            <h1 className="font-semibold mb-3 text-[37px] md:text-xl">Sign in to <span className="text-[#4A8D34]">Mariseth Farms</span></h1>
            <div className="text-sm text-slate-500">Welcome back! Please sign in to continue</div>
          </div>
        </div>
        <LoginForm/>
      </div>
    
  );
}
