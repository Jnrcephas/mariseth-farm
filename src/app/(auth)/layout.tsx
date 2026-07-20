// import Image from "next/image";
import { getAuthSession } from "@/lib/auth";
import { routeTo } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const session = getAuthSession()
      if (await session) {
        redirect(routeTo.dashboard); 
      }
    return (
         <div className="mt-[50px] grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-3 md:p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="w-full md:w-[500px] gap-[32px] mt-[300px] items-center justify-center absolute">
                {children}
                <div className="shadow-xl text-[#64748B] flex items-center justify-center rounded-2xl bg-[#E1E4EA] text-center py-5 h-[60px] -mt-5 -z-10 absolute w-full">
                    <div className="flex items-center gap-x-3 mt-5">
                        {/* <h1 className="text-sm font-medium">Powered by</h1>{" "} */}
                        {/* <Image
                            className="mx-auto w-[100px]"
                            src="/images/sales-forge-logo.jpeg"
                            alt="meriseth logo"
                            width={500}
                            height={500}
                            priority
                        /> */}
                    </div>

                </div>
            </main>
        </div>
    );
  }