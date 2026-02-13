import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex justify-center px-4 pt-40">
            <div className="w-full max-w-md space-y-6 text-center">
                <h1 className="text-4xl font-semibold">404</h1>

                <p className="text-muted-foreground">
                    The page you are looking for does not exist.
                </p>

                <Link to="/">
                    <Button>Go Home</Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
