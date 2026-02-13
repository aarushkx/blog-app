import Blog from "../models/blog.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js";
import { APP_NAME } from "../lib/config.js";

export const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const imageLocalPath = req.file?.path;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        let image = {
            public_id: null,
            url: null,
        };

        if (imageLocalPath) {
            const uploadedImage = await uploadOnCloudinary(
                imageLocalPath,
                `${APP_NAME.toLowerCase()}/blogs`,
            );

            if (!uploadedImage?.secure_url) {
                return res.status(500).json({ message: "Image upload failed" });
            }

            image = {
                public_id: uploadedImage.public_id,
                url: uploadedImage.secure_url,
            };
        }

        const blog = await Blog.create({
            user: req.user._id,
            title,
            content,
            image,
        });

        return res.status(201).json(blog);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: createBlog ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("user", "email avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json(blogs);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getAllBlogs :: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate(
            "user",
            "email avatar",
        );

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json(blog);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getSingleBlog :: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (blog.image?.public_id) {
            await deleteFromCloudinary(blog.image);
        }

        await blog.deleteOne();

        return res.status(200).json({
            message: "Blog deleted successfully",
        });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: deleteBlog :: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
