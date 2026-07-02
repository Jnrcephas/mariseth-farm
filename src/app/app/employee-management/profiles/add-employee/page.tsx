"use client"
import { AddEmployee } from "@/modules/EmployeeManagement/Profiles/AddEmployee";
export default function Page(){
    const refetch = () =>{
        console.log("Refetch")
    }
    return(
        <div>
            <AddEmployee refetch={refetch} />
        </div>
    )
}