import axios from 'axios';

export const apiEndpoint = {
    login: '/auth/login',
    logout: '/auth/logout',
    sendVerifyCode: '/auth/send-verify-code',
    signup: '/auth/signup',
    me: '/auth/me',
    editMe: '/user/edit',
    room: '/room',
};

export const getToken = () => `Bearer ${localStorage.getItem('meet-token')}`;

export const Api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        Authorization: getToken(),
    },
});
export interface LoginApiResult {
    token: string;
    message: string;
}

export interface LoginApiFailedResult {
    message: string;
}
