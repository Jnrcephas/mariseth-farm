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
                (set) => ({
                    ...initState,
                    updateUser: (user) => set(() => ({ user })),
                    setUserNotifications: (notifications: any) => set(() => ({ notifications })),
                }),
                { name: 'user-store' }
            )
        )
    )
}
