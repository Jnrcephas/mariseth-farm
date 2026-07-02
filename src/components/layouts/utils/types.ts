import { LucideIcon } from 'lucide-react';

export interface ISidebarItem {
    title?: string;
    icon?: LucideIcon;
    subPages?: Partial<ISidebarItem>[];
    route: string;
    slug: string;
    items?: any[];
  }
  
  export interface ISidebarGroup {
    title?: string;
    pages: ISidebarItem[];
  }
  
  export interface ISidebarList {
    pages: ISidebarGroup[];
  }

  export interface IWssResponseProps{
    type:string;
    message_type: string; 
    results:any;
    result?: any;
    message:any;
    status:number;
    errors?:any;
    error?:any;
    payload?:any;
    team?:any;
    roster_schedules?:any;
    pagination?:any;
    has_permission?:boolean;
    exported_file?: string;
    report_message?: string;
}