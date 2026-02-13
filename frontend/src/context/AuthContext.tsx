import { createContext, useContext, useEffect, useState } from "react";

interface User {
    _id: string;
    email: string;
    avatar?: {
        url: string;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE}/auth/me`,
                { credentials: "include" },
            );

            if (!res.ok) {
                setUser(null);
                return;
            }

            const data = await res.json();
            setUser(data);
        } catch {
            setUser(null);
        }
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    const logout = () => {
        setUser(null);
    };

    useEffect(() => {
        const init = async () => {
            await fetchUser();
            setLoading(false);
        };
        init();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
