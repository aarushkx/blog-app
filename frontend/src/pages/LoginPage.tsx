import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
    const { user, loading, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (loading) return null;

    if (user) {
        return <Navigate to="/feed" replace />;
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
            await refreshUser();
            navigate("/feed");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center px-4 pt-40">
            <div className="w-full max-w-md space-y-4">
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <h1 className="text-2xl font-semibold text-center">
                        Hey, welcome back!
                    </h1>

                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" disabled={submitting}>
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </Button>
                </form>

                <p className="text-sm text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="underline">
                        Register
                    </Link>
                </p>

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
