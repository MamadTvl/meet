import { PropsWithChildren, useEffect } from 'react';
import { useAuthStore } from '../../store/user';
import Footer from './Footer';
import Header from './header/Header';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    const setUser = useAuthStore((store) => store.setUser);
    
    useEffect(() => {
        setUser();
    }, []);
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};
export default Layout;
