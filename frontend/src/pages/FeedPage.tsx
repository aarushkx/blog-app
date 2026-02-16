import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Navigate } from "react-router-dom";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import moment from "moment";

interface Blog {
    _id: string;
    title: string;
    content: string;
    image?: {
        url: string;
    };
    createdAt: string;
    user: {
        _id: string;
        email: string;
        avatar: {
            url: string;
        };
    };
}

const FeedPage = () => {
    const { user, loading } = useAuth();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loadingFeed, setLoadingFeed] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE}/blog/`,
                    { credentials: "include" },
                );

                const data = await response.json();
                setBlogs(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingFeed(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) return null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleDelete = async (id: string) => {
        try {
            setDeletingId(id);

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE}/blog/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                },
            );

            if (!response.ok) {
                throw new Error("Failed to delete blog");
            }

            setBlogs((prev) => prev.filter((blog) => blog._id !== id));
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    if (loadingFeed) {
        return (
            <div className="flex items-center justify-center text-muted-foreground gap-2 pt-20">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading...</span>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
            {blogs.length === 0 && (
                <p className="text-center text-muted-foreground">
                    No blog posts yet.
                </p>
            )}

            {blogs.map((blog) => (
                <div key={blog._id} className="space-y-4 border-b pb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage
                                    src={blog.user?.avatar?.url || ""}
                                />
                                <AvatarFallback>
                                    {blog.user?.email?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-medium">
                                    {blog.user?.email}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {moment(blog.createdAt).format("ll")}
                                </span>
                            </div>
                        </div>

                        {user?._id === blog.user?._id && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Delete this post?
                                        </DialogTitle>
                                    </DialogHeader>

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">
                                                Cancel
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(blog._id)
                                            }
                                            disabled={deletingId === blog._id}
                                        >
                                            {deletingId === blog._id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                "Delete"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-md font-semibold">{blog.title}</h2>

                    {/* Image */}
                    {blog.image?.url && (
                        <div className="w-full flex justify-left my-4">
                            <img
                                src={blog.image.url}
                                alt={blog.title}
                                className="max-h-96 w-auto object-contain rounded-md"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <p>{blog.content}</p>
                </div>
            ))}
        </div>
    );
};

export default FeedPage;
