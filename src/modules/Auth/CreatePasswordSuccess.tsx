import { routeTo } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function CreatePasswordSuccess() { 
    return(
        <div className="mt-5 p-5">
            <Link href={routeTo.login}>
                <Button className="w-full rounded-lg h-[40px] cursor-pointer bg-[#4A8D34] hover:bg-[#4A8D34] font-medium" type="submit">
                    Go to login
                </Button>
            </Link>
        </div>
    )
}