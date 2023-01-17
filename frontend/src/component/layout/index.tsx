import { PropsWithChildren } from "react";
import Footer from "./Footer";
import Header from "./header/Header";

const Layout: React.FC<PropsWithChildren> = ({children}) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};
export default Layout;
