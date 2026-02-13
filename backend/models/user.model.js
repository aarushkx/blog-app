import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
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

const User = mongoose.model("User", userSchema);

export default User;
