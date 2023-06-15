import { Box, CircularProgress } from '@mui/material';
import React, { PropsWithChildren, useMemo } from 'react';
import {
    BrowserRouter,
    Link as RouterLink,
    LinkProps as RouterLinkProps,
    Navigate,
    Route,
    RouteProps,
    useNavigate,
} from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { useAuthStore } from '../../store/user';

export const LinkBehavior = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
    const { href, ...other } = props;
    // Map href (MUI) -> to (react-router)
    return <RouterLink ref={ref} to={href} {...other} />;
});

export const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
    const [loading, isLogin] = useAuthStore((store) => [
        store.loading,
        store.isLogin,
    ]);
    const navigate = useNavigate();
    if (!loading && !isLogin) {
        navigate('/login');
    }
    if (!loading && isLogin) {
        return <>{children}</>;
    }
    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            height={'100vh'}
            width={'100%'}
            alignItems={'center'}>
            <CircularProgress size={48} color={'secondary'} />
        </Box>
    );
};

export function Router(props: { children?: React.ReactNode }) {
    const { children } = props;
    if (typeof window === 'undefined') {
        return <StaticRouter location='/'>{children}</StaticRouter>;
    }

    return <BrowserRouter>{children}</BrowserRouter>;
}
