"use client";
import { useCallback} from "react";
import { signOut } from "next-auth/react";
import { useUserStore } from "@/app/providers/user-store-provider";
import { IPermObj } from "./useHasAccess";
import { API_BASEURL } from "@/lib/constants";
import { useAccountsAuthLogout } from "@/apis/adminApiComponents";
import { toast } from "sonner";

export const useUserActions = () =>{
    const { updateUser, user} = useUserStore((state) => state)
	// const [isLoading, setIsLoading] = useState(false);

    const {mutate: handleLogout, isPending: isLoading} = useAccountsAuthLogout({
        onSuccess: () => {
            toast.success("Logged out successfully")
            handleLogoutRedirect()
        },
        onError: () => {
            handleLogoutRedirect()
        }
    })

    const handleLogoutRedirect = async () => {
        updateUser(null)
        await signOut({
            redirect: true,
            callbackUrl: `/?callbackUrl=${window.location.pathname}`,
        })
    };

    const logout = () =>{
        handleLogout({
            body: {
                refresh_token: user?.refresh_token ?? ""
            }
        })
    }

    const fetchUserDetails = useCallback(async () => {
        try {
        const response = await fetch(`${API_BASEURL}/accounts/auth/me`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.access_token}`
            },
        });

        if (response.status === 401) {
            logout();
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: any = await response.json();
        
        if (result.success && result.data) {
            const userData = result.data
            const permObj: { [key: string]: IPermObj } = {};
            const permissions = userData?.user?.groups[0]?.permissions as unknown as any[] || []
            permissions?.map((perm: IPermObj) => {
                permObj[`${perm.codename}`] = perm
            })
            updateUser({...userData?.user, permissions:permObj} as any)
        }
        } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('Network error while fetching user details');
        }
        }
    }, [updateUser, user, logout]);

    return {logout, user, isLoading, fetchUserDetails}
  }