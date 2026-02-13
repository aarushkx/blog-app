import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const ProfilePage = () => {
    const { user, loading, refreshUser } = useAuth();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    if (!loading && !user) {
        return <Navigate to="/login" replace />;
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUpdating(true);
        setError("");

        try {
            const formData = new FormData();
            if (password) formData.append("password", password);
            if (avatar) formData.append("avatar", avatar);

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE}/user/profile`,
                {
                    method: "PUT",
                    credentials: "include",
                    body: formData,
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Update failed");
            }

            await refreshUser();
            setPassword("");
            setAvatar(null);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleLogout = async () => {
        await fetch(`${import.meta.env.VITE_API_BASE}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        logout();
        navigate("/login");
    };

    const handleDelete = async () => {
        await fetch(`${import.meta.env.VITE_API_BASE}/user/profile`, {
            method: "DELETE",
            credentials: "include",
        });

        logout();
        navigate("/register");
    };

    return (
        <div className="min-h-screen flex justify-center px-4 pt-24">
            <div className="w-full max-w-md space-y-6">
                <h1 className="text-2xl font-semibold text-center">Profile</h1>

                {/* Avatar and Email */}
                <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.avatar?.url || ""} />
                        <AvatarFallback>
                            {user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <p className="text-sm text-muted-foreground">
                        {user?.email}
                    </p>
                </div>

                {/* Update Form */}
                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                    <Input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                    <Button type="submit" disabled={updating}>
                        {updating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Profile"
                        )}
                    </Button>
                </form>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1">
                                Logout
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm Logout</DialogTitle>
                            </DialogHeader>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>

                                <Button onClick={handleLogout}>Logout</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="flex-1">
                                Delete Account
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Are you sure you want to delete your
                                    account?
                                </DialogTitle>
                            </DialogHeader>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>

                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
