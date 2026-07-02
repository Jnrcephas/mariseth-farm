import React from 'react';
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import TopNavbar from './TopNavBar';
import { AppSidebar } from './AppSidebar';

const MainBaseLayout = ({ children }:{children: React.ReactNode;}) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="h-fulls w-full flex flex-col bg-muted dark:bg-background">
        <SidebarTrigger  className='absolute z-[900] mt-2 ml-2'/>
        <TopNavbar />
        <div className="p-5 sm:container sm:mx-auto h-[calc(100%-57px)] overflow-auto ">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainBaseLayout;
