import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const CreateBlogPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!loading && !user) {
        return <Navigate to="/login" replace />;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);

            if (image) {
                formData.append("image", image);
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE}/blog/create`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create blog");
            }

            navigate("/feed");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center px-4 pt-24">
            <div className="w-full max-w-xl space-y-6">
                <h1 className="text-2xl font-semibold text-center">
                    Create New Post
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setImage(e.target.files[0]);
                            }
                        }}
                    />

                    <textarea
                        placeholder="Write your thoughts..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="min-h-36 resize-none rounded-md border px-3 py-2 text-sm"
                    />

                    <Button type="submit" disabled={submitting}>
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            "Publish"
                        )}
                    </Button>

                    {error && (
                        <p className="text-sm text-red-500 text-center">
                            {error}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateBlogPage;
