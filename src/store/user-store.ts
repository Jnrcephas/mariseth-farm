import { createStore } from 'zustand/vanilla'
import { persist, devtools } from 'zustand/middleware'
import { UserWithToken } from '@/apis/adminApiSchemas'


export type UserState = {
    user: UserWithToken | null
    notifications: any[];
    setUserNotifications: (notifications: any[]) => void
    
}

export type UserActions = {
    updateUser: (user: UserWithToken | null) => void
}



export type UserStore = UserState & UserActions

export const defaultInitState: UserState = {
    user: null,
    notifications: [],
    setUserNotifications: () => { },
}

export const createUserStore = (initState: UserState = defaultInitState) => {
    return createStore<UserStore>()(
        devtools(
            persist(
                (set, get) => ({
                    ...initState,
                    // Guard against redundant writes: if the incoming user data is
                    // value-identical to what's already in the store, skip the set().
                    // Without this, calling updateUser() with a freshly-fetched-but-
                    // identical object creates a brand new reference every time,
                    // which forces every component subscribed to the store (i.e. almost
                    // every data-fetching component in the app, via useAdminApiContext)
                    // to re-render even though nothing actually changed.
                    updateUser: (user) => {
                        const current = get().user;
                        if (JSON.stringify(current) === JSON.stringify(user)) return;
                        set(() => ({ user }));
                    },
                    setUserNotifications: (notifications: any) => set(() => ({ notifications })),
                }),
                { name: 'user-store' }
            ),
            { enabled: process.env.NODE_ENV !== 'production' }
        )
    )
}
