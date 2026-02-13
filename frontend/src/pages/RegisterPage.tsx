import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const RegisterPage = () => {
    const { user, loading, refreshUser } = useAuth();
    const navigate = useNavigate();

    if (loading) return null;

    if (user) {
        return <Navigate to="/feed" replace />;
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);

            if (avatar) {
                formData.append("avatar", avatar);
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE}/auth/register`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
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
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <h1 className="text-2xl font-semibold text-center">
                        Get Started
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

                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setAvatar(e.target.files[0]);
                            }
                        }}
                    />

                    <Button type="submit" disabled={submitting}>
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Register"
                        )}
                    </Button>
                </form>

                <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="underline">
                        Login
                    </Link>
                </p>

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
