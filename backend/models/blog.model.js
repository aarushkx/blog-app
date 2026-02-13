import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            public_id: {
                type: String,
                default: null,
            },
            url: {
                type: String,
                default: null,
            },
        },
    },
    { timestamps: true },
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
