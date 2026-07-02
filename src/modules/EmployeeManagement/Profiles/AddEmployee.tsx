"use client"
import { EmployeePersonalInfo } from "./AddProfile/EmployeePersonalInfo";
import { Employee } from "@/apis/adminApiSchemas";
import { useState } from "react";
import { EmployeeQualifications } from "./AddProfile/EmployeeQualifications";
import { EmployeeContract } from "./AddProfile/EmployeeContract";

export function AddEmployee({isEdit=false, defaultData, formLevel=1, refetch}:{isEdit?: boolean; defaultData?: Employee; formLevel?: number; refetch: () => void;}){
    
    const [level, setLevel] = useState(formLevel)

    const levels = [
        {
            level: 1,
            title: "Personal Information"
        },
        {
            level: 2,
            title: "Documents"
        },
        {
            level: 3,
            title: "Contract"
        }
    ]

    const getLevelClassName = (onLevel: number) => {
        let classNames = {
            bg: "bg-white",
            text: "text-[#64748B]",
            circle_text: "text-white",
            circle_bg: "bg-[#94A3B8]"
        }

        if(level >= onLevel){
            classNames = {
                bg: "bg-[#4A8D34]",
                text: "text-white font-medium",
                circle_text: "text-[#4A8D34]",
                circle_bg: "bg-white"
            }
        }
        return classNames
    }

    return(
        <div className="mt-5">
            <div className="max-w-5xl mx-auto bg-white p-5 rounded-lg">
                <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
                    {levels?.map((item, idx) => (
                        <div  key={`l-${idx}`} className={`${getLevelClassName(idx + 1)?.bg} border text-sm relative h-[48px]  rounded-lg flex items-center`}>
                            <div className="mx-5 flex gap-5 items-center">
                                <div className={`font-medium w-6 h-6 ${getLevelClassName(idx + 1)?.circle_text} ${getLevelClassName(idx + 1)?.circle_bg} rounded-full  flex justify-center items-center`}>
                                    {item.level}
                                </div>
                                <div className={`${getLevelClassName(idx + 1)?.text} `}> {item.title}</div>
                            </div>
                        </div>
                    ))}
                    
                </div>
                <div className="mt-8">
                    {level === 1 &&
                        <EmployeePersonalInfo 
                            isEdit={isEdit} 
                            defaultData={defaultData} 
                            setLevel={setLevel}
                            refetch={refetch}
                        />
                    }
                    {level === 2 &&
                        <EmployeeQualifications 
                            defaultData={defaultData} 
                            setLevel={setLevel}
                            refetch={refetch}
                        />
                    }
                    {level === 3 &&
                        <EmployeeContract 
                            defaultData={defaultData} 
                            setLevel={setLevel}
                        />
                    }
                </div>
            </div>
            
        </div>
    )
}