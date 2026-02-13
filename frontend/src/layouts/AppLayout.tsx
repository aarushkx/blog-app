import { useLocation } from "react-router-dom";
import Header from "@/components/custom/Header";

interface Props {
    children: React.ReactNode;
}

const AppLayout = ({ children }: Props) => {
    const location = useLocation();

    const showHeaderRoutes = ["/feed", "/create", "/profile"];

    const shouldShowHeader = showHeaderRoutes.includes(location.pathname);

    return (
        <div className="min-h-screen flex flex-col">
            {shouldShowHeader && <Header />}
            <main className="flex-1">{children}</main>
        </div>
    );
};

export default AppLayout;
