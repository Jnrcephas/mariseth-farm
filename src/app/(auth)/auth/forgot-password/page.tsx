import ForgotPasswordForm from "@/modules/Auth/ForgotPasswordForm";
export default function Page() {
  
  return (
      <div  className="border border-[#64748B0D] rounded-2xl bg-white py-8 mt-10 !z-10">
        <div className="flex gap-4 items-center justify-center flex-col">
          <div className="text-centers px-5">
            <h1 className="font-semibold mb-3 text-[37px] md:text-xl">Forgot password</h1>
            <div className="text-sm text-slate-500">Create a new password for your Mesh account to secure your account.</div>
          </div>
        </div>
        <ForgotPasswordForm/>
      </div>
    
  );
}
