"use client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useWebSocketMethods } from "@/contexts/WebsocketContext"
import { Bell, DownloadCloud, Trash2 } from "lucide-react"
import { IWssResponseProps } from "./utils/types"
import { useEffect, useState } from "react"
import { useUserStore } from "@/app/providers/user-store-provider"
import moment from "moment"
import { downloadCSV, formatText } from "@/lib/helpers"

export default function Notifications(){
    const {message, readyState} = useWebSocketMethods()
    const [newNotifications, setNewNotifications] = useState<any[]>([])
    const [openNotification, setOpenNotification] = useState(false)

    const { notifications, setUserNotifications } = useUserStore(
        (state) => state,
    );

    useEffect(() =>{
        if(notifications.length > 0) setNewNotifications(notifications)
    },[readyState])

    useEffect(() =>{
        getNotification(message)
    },[message])

    function handleDeleteNoti(idx: number){
        const updatedNotis = notifications.filter(item => item.id != idx);
        setNewNotifications(updatedNotis)
        setUserNotifications(updatedNotis)
    }

    function handleClearAllNotifications(){
        setUserNotifications([])
        setNewNotifications([])
        setOpenNotification(false)
        
    }

    function getNotification(response:IWssResponseProps){
       
        if(response?.message_type === "export_notification"){
            if(response?.message?.results){
                const notiNo = newNotifications.length + 1
                const updatedNotifications =[{
                    id: notiNo,
                    notiType: "export_notification",
                    data: response?.message?.results,
                    export_type: response?.message?.export_type || "export",
                    dateTime: new Date().toISOString()
                }, ...notifications]
                setNewNotifications(updatedNotifications)
                setUserNotifications(updatedNotifications)
                setOpenNotification(true)
            }
        }
    }

    const  getNofiMenu = ({notiType, data, export_type, dateTime}:{
        notiType: "export_notification";
        data: any;
        export_type: string;
        dateTime: string;
        }) => {
            if(notiType === "export_notification"){
                return (
                    <div className="flex items-start gap-2 flex-1 border-bs border-default-50 px-4">
                        <div className="flex-1 flex flex-col gap-0.5 mb-2">
                            <div className="text-sm  text-gray-500  dark:group-hover:text-default-800  font-normal   truncate">
                            Your {formatText(export_type)} is ready
                            </div>
                            <div className="justify-between flex items-center gap-2">
                            <div onClick={() => downloadCSV(data, "reports.csv")} className="flex hover:text-blue-500 hover:underline gap-1 items-center cursor-pointer text-xs text-default-600  dark:group-hover:text-default-700 font-normal line-clamp-1  ">
                                <DownloadCloud size={15}/> Click to download
                            </div>
                            <div className=" text-default-400 dark:group-hover:text-default-500  text-xs"> 
                                {moment(dateTime).fromNow()}
                            </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }

    return(
        <div>
          <Popover open={openNotification} onOpenChange={setOpenNotification}>
            <PopoverTrigger onClick={() => setOpenNotification(!openNotification)}>
                <div className="cursor-pointer relative">
                    {newNotifications.length ?
                        <div className="absolute z-10 -top-2 -right-1 bg-red-500 w-[10px] h-[10px] text-xs rounded-full text-white font-semibold justify-center items-center flex p-2">
                            {newNotifications.length}
                        </div>:""
                    }
                  <Bell className={`text-[#4A8D34] ${newNotifications.length ? "animate-tada" : ""}`} />
                </div>
            </PopoverTrigger>
            <PopoverContent className='px-0 md:w-[350px]' sideOffset={5} align="end" >
              <div className="px-2 text-sm font-semibold">
                <div className="flex justify-between border-b border-default-100 ">
                  <div className="text-sm text-default-800  font-medium mb-2">Notifications</div>
                 
                </div>
              </div>
              <div  className="overflow-y-auto max-h-[500px]">
                <div role="menuitem" className="flex flex-col py-2 gap-3 relative">
                    {newNotifications.length > 0 ?
                        newNotifications.map((noti, idx) => (
                            <div key={idx} className="hover:bg-gray-50 relative">
                                <div className="absolute w-full flex justify-end mt-1 cursor-pointer px-1" 
                                    onClick={() => handleDeleteNoti(noti?.id)}>
                                    <Trash2 size={12} className="text-end pull-right text-red-600"/>
                                </div>
                                {getNofiMenu(noti)}
                            </div>
                        )):
                        <div className="text-center text-sm mt-2">
                            No messages available
                        </div>
                    }
                    
                    {/* <div className="flex items-start gap-2 flex-1 border-b border-default-50 ">
                        <div className="flex-1 flex flex-col gap-0.5 mb-2">
                            <div className="text-sm  text-gray-500  dark:group-hover:text-default-800  font-normal   truncate">
                            Your farms export is ready
                            </div>
                            <div className="justify-between flex items-center gap-2">
                            <div className="flex hover:text-blue-500 hover:underline gap-1 items-center cursor-pointer text-xs text-default-600  dark:group-hover:text-default-700 font-normal line-clamp-1  ">
                                <DownloadCloud size={15}/> Click to download
                            </div>
                            <div className=" text-default-400 dark:group-hover:text-default-500  text-xs"> 
                                2 days ago
                            </div>
                            </div>
                        </div>
                    </div> */}
                </div>
                
              </div>
              {newNotifications.length ?
                <div className="mt-1 border-t-1 py-2">
                    <div className="flex justify-center absolute bottom-2 w-full ">
                        <span className="cursor-pointer rounded-md text-sm text-green-700 font-medium" onClick={handleClearAllNotifications}>Clear All</span>
                    </div>
                </div>:""}
            </PopoverContent>
          </Popover>
        </div>
    )
}