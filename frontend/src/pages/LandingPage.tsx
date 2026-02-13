import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const LandingPage = () => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (user) {
        return <Navigate to="/feed" replace />;
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-semibold">Welcome to {APP_NAME}</h1>

            <p className="text-muted-foreground">
                A minimal place to share your thoughts.
            </p>

            <div className="flex gap-4 mt-2">
                <Button asChild>
                    <Link to="/register">Register</Link>
                </Button>

                <Button variant="outline" asChild>
                    <Link to="/login">Login</Link>
                </Button>
            </div>
        </div>
    );
};

export default LandingPage;
