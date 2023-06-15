import { Api, apiEndpoint, getToken } from './../../utils/Api';
import { create } from 'zustand';

export interface User {
    firstName: string | null;
    lastName: string | null;
}

export interface AuthStore {
    isLogin: boolean;
    loading: boolean;
    user: User | null;
    setLoading: (loading: boolean) => void;
    setUser: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
    isLogin: false,
    loading: true,
    user: null,
    logout: () => set({ isLogin: false, loading: false }),
    setUser: async () => {
        const { user } = get();
        if (!user) {
            set(() => {
                return { loading: true };
            });
        }
        try {
            const response = await Api<{ user: User }>(apiEndpoint.me, {
                headers: {
                    Authorization: getToken(),
                },
            });
            const user = response.data.user;
            set({ user, loading: false, isLogin: true });
        } catch (err) {
            set({ user: null, loading: false, isLogin: false });
        }
    },
    setLoading: (loading) => set({ loading }),
}));
