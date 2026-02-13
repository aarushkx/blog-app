import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="w-full border-b">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                {/* Left */}
                <Link to="/feed" className="text-lg font-semibold">
                    {APP_NAME}
                </Link>

                {/* Right */}
                <div className="flex items-center gap-3">
                    <Link to="/create">
                        <Button size="icon">
                            <SquarePen className="h-5 w-5" />
                        </Button>
                    </Link>

                    <Link to="/profile">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.avatar?.url || ""} />
                            <AvatarFallback>
                                {user?.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
