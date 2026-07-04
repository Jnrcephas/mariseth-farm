"use client"
import React, { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserStore } from '@/app/providers/user-store-provider';
import { useUserActions } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';
import { routeTo } from '@/lib/constants';
import Notifications from './Notifications';

const TopNavbar = () => {
  const user = useUserStore((state) => state.user)
  const {logout, fetchUserDetails, isLoading} = useUserActions()

  const router = useRouter()

  // Intentionally run once on mount. Re-running this on every pathName
  // change fired an extra /accounts/auth/me request on every single
  // in-app navigation for no benefit (permissions don't change mid-session),
  // and combined with the update loop in useAuth, was the main source of
  // app-wide sluggishness.
  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full px-4 p-2 flex justify-between bg-[#4A8D34] h-[57px] sticky top-0 z-50 items-center">
      <div className="flex lg:gap-2 lg:flex-row items-center">
      </div>
      <div className=" border-l-1 border-[#fff] gap-x-3 flex px-3 items-center">
        <Notifications />
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Avatar>
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback className='capitalize font-bold text-[#4A8D34]'>{user?.first_name?.[0]}{user?.last_name?.[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Hi, {user?.first_name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer"  onClick={() => router.push(routeTo.profileSettings)}>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={logout}>Logout {isLoading && <Loader className='animate-spin'/>} </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavbar;
