"use client";
import { routeTo } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";


export default function SentMagicLink() { 

    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    return(
        <div className="mt-5 p-5">
            <Link href={`${routeTo.createPassword}?email=${email}`}>
                <Button className="w-full rounded-lg h-[40px] cursor-pointer bg-[#4A8D34] hover:bg-[#4A8D34] font-medium" type="submit">Proceed</Button>
            </Link>
        </div>
    )
}