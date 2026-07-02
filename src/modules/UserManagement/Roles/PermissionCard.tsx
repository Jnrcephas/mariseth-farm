import { groupPermissionsByCodename } from "../utils/helpers";

export default function PermissionCard({
    bg, title, textColor="text-black dark:text-white dark:hover:text-primary", permissions=[], hasAccess
    }:
    {   
        bg?: string; 
        title?:string;
        textColor?: string;
        permissions: any[];
        hasAccess?: boolean;
    }){
      const groupedPermissions = groupPermissionsByCodename(permissions);

    return(
        <div className={`rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card border-stroke dark:border-dark-3 border-r`}>
            <div className={`${bg} border-b border-stroke px-7.5 py-5 border-stroke dark:border-dark-3`}>
                <h5 className={`${textColor}  font-semibold `}>
                    {title}
                </h5>
            </div>
            <div className="px-7.5 pb-3 pt-6">
              {Object.entries(groupedPermissions)?.length ? <>
                {Object.entries(groupedPermissions).map(([group, perms]) => (
                  <div key={group} className="mb-5">
                    <div className="mb-3">
                      <h2 className="capitalize font-medium bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white px-2 rounded py-1" >{group.replaceAll("_", " ")}</h2>
                      <hr className="border-stroke dark:border-dark-3" />
                    </div>
                    <div  className="w-full font-medium px-3 text-[#64748B]">
                        {perms.map((perm) => (
                            <span key={perm.id}
                                className={"flex mb-3"}
                                >
                              <div className="flex">
                                <span className={`mr-2 ${textColor}`}>{hasAccess ? "✓" : "✘"}</span> {perm.name}
                              </div>
                            </span>
                        ))}
                    </div>
                  </div>
                ))}
               </>:<div className="text-center p-5">None</div>
              }
            </div>
        </div>
    )
}