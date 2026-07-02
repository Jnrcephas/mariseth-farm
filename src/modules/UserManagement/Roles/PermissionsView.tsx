import React from "react";
import PermissionCard from "./PermissionCard";


const PermissionsView = ({groupPermissions}:{groupPermissions: any}) => {

  return (
    <div>
        <div className="grid grid-cols-1  md:grid-cols-2 ">
            <PermissionCard 
                title="What this role can access" 
                bg="bg-[#219653]/[0.08]" 
                textColor="text-[#219653]"  
                permissions={groupPermissions?.permissions?.filter((item: any) => item?.is_active === true)}
                hasAccess
            />
            <PermissionCard 
                title="What this role can&apos;t access" 
                bg="bg-[#D34053]/[0.08]" 
                textColor="text-[#D34053]" 
                permissions={groupPermissions?.permissions?.filter((item: any) => item?.is_active === false)}
            />

        </div>
    </div>
  );
};

export default PermissionsView;
