"use client";
import { useCallback, useRef } from "react";
import { signOut } from "next-auth/react";
import { useUserStore } from "@/app/providers/user-store-provider";
import { IPermObj } from "./useHasAccess";
import { API_BASEURL } from "@/lib/constants";
import { useAccountsAuthLogout } from "@/apis/adminApiComponents";
import { toast } from "sonner";

export const useUserActions = () =>{
    // Select only the slices this hook actually needs, instead of the whole
    // store object. Subscribing to the whole store means this hook (and every
    // component that calls it) re-renders on *any* store change, including
    // ones it doesn't care about (e.g. notifications).
    const updateUser = useUserStore((state) => state.updateUser)
    const user = useUserStore((state) => state.user)

    // Keep a live ref to the current user/token so fetchUserDetails and logout
    // don't need `user` in their dependency arrays. Depending on `user` was the
    // root cause of an infinite loop: fetchUserDetails() -> updateUser() ->
    // new `user` reference -> fetchUserDetails recreated -> effects depending on
    // it re-run -> fetchUserDetails() again -> forever. That loop was hammering
    // /accounts/auth/me continuously and re-rendering the whole app on every tick.
    const userRef = useRef(user);
    userRef.current = user;

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

    const logout = useCallback(() => {
        handleLogout({
            body: {
                refresh_token: userRef.current?.refresh_token ?? ""
            }
        })
    }, [handleLogout])

    const fetchUserDetails = useCallback(async () => {
        try {
        const response = await fetch(`${API_BASEURL}/accounts/auth/me`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userRef.current?.access_token}`
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
            // updateUser() itself now no-ops if the data is unchanged (see
            // store/user-store.ts), so this is safe to call without causing
            // extra re-renders when nothing actually changed.
            updateUser({...userData?.user, permissions:permObj} as any)
        }
        } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('Network error while fetching user details');
        }
        }
    }, [updateUser, logout]);

    return {logout, user, isLoading, fetchUserDetails}
  }