import React from "react";

const GroupsSidebar = ({groups, activeTab, setActiveTab}:{
    groups: any[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}) => {

  return (
    <>
      <div
        className={`fixed bottom-0 top-22.5  flex w-[230px] -translate-x-[120%] flex-col rounded-[7px] border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark lg:static lg:w-1/5 lg:translate-x-0 lg:border-none 
          !translate-x-0 duration-300 ease-linear
`}
      >
       <div className="px-4 pt-4">
          <button className="mb-1.5 flex w-full items-center justify-center gap-2 rounded-[7px] hover:bg-opacity-90  text-primary px-4 py-[9px] font-medium ">
            
            Account Roles
          </button>
          <hr className="border-stroke dark:border-dark-3"/>
        </div>

        {/* <div className="p-5 text-center font-bold dark:text-white ">Account Types</div> */}
        <div className="no-scrollbar max-h-full overflow-auto  ">
          <ul className="flex flex-col gap-1">
            {groups?.map((item, index) => (
              <li key={index}>
                <div className="px-4 pt-4">
                    <button onClick={() => setActiveTab(item.name)} className={`${activeTab === item.name ? "bg-[#17a34a] text-white" : "bg-[#efefef] text-[#798888] "} cursor-pointer duration-300 ease-linear flex w-full items-center gap-2 rounded-[7px] px-4 py-[9px] font-medium flex justify-center`}>
                        {item.name}
                    </button>
                </div>
                {/* <Link
                  href="#"
                  className="relative flex items-center gap-2.5 rounded-[7px] px-2.5 py-[9px] font-medium text-dark-4 duration-300 ease-linear hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-2 dark:hover:text-white"
                >
                  
                </Link> */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default GroupsSidebar;
