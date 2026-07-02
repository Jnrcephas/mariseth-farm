"use client"
import { ReactNode, createContext, useContext, useState  } from "react";
import useWebSocket from "react-use-websocket";
import { useUserActions } from "@/hooks/auth/useAuth";
import { toast } from "sonner";
import { WSS_URL } from "@/lib/constants";


const WebSocketContext = createContext<any | undefined>(undefined);

export function useWebSocketMethods() {
  return useContext(WebSocketContext);
}

export default function WebSocketProvider({ children }: { children: ReactNode }) {
    const {logout, user} = useUserActions();
    const [message, setMessage] = useState<any>();
    const [messages, setMessages] = useState<{[key: string]: any}>({});
    const [isOnline, setIsOnline] = useState<boolean>(false);


    const accessToken = user?.access_token as string
    const _WSS_URL = WSS_URL as string;
   
    const {sendJsonMessage, readyState, lastJsonMessage} = useWebSocket(_WSS_URL, 
        {
        onOpen: () => {
          console.log('WebSocket connection established.');
          setIsOnline(true)
        },
        onClose: () => {
          console.log('WebSocket connection closed.');
          setIsOnline(false)
        },
        onMessage(event) {
          const resp = JSON.parse(event.data)
          if(resp?.error === "Authentication Credentials Invalid"){
            toast.error("Session has expired, please login again");
            logout()
          }else{
              setMessage(resp);
              setMessages((prev: any) => ({...prev, [resp?.message_type]: resp }));
          }
        },
        shouldReconnect: (closeEvent) => {
          // reconnect only if server closed unexpectedly
          return closeEvent.code !== 1000; 
        },
        reconnectInterval: 5000,
        reconnectAttempts: 60,
        retryOnError: true,
        queryParams: {token: accessToken}
    });
    
    return (
        <WebSocketContext.Provider value={{ sendJsonMessage, readyState, lastJsonMessage, message,messages, isOnline}}>
            {children}
        </WebSocketContext.Provider>
      );
}
