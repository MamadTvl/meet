import React from 'react';
import {
    BrowserRouter,
    Link as RouterLink,
    LinkProps as RouterLinkProps,
} from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

export const LinkBehavior = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
    const { href, ...other } = props;
    // Map href (MUI) -> to (react-router)
    return (
        <RouterLink ref={ref} to={href} {...other} />
    );
});

export function Router(props: { children?: React.ReactNode }) {
    const { children } = props;
    if (typeof window === 'undefined') {
        return <StaticRouter location='/'>{children}</StaticRouter>;
    }

    return <BrowserRouter>{children}</BrowserRouter>;
}
