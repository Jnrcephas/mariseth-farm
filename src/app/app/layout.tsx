import React from 'react';
import MainBaseLayout from '@/components/layouts/MainBaseLayout';
import IdleTimeOutNotification from '@/components/IdleTimeOutModal';
import WebSocketContext from "@/contexts/WebsocketContext";


const MainLayout = ({ children }:{children: React.ReactNode;}) => {
  return (
    <section>
      <WebSocketContext>
        <IdleTimeOutNotification/>
        <MainBaseLayout>{children}</MainBaseLayout>
      </WebSocketContext>
    </section>
  );
};

export default MainLayout;
