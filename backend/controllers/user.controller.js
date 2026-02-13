import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js";
import { APP_NAME, MIN_PASSWORD_LEN } from "../lib/config.js";

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { password } = req.body;
        const avatarLocalPath = req.file?.path;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (password) {
            if (password.length < MIN_PASSWORD_LEN) {
                return res.status(400).json({
                    message: `Password must have at least ${MIN_PASSWORD_LEN} characters`,
                });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        if (avatarLocalPath) {
            const uploadedAvatar = await uploadOnCloudinary(
                avatarLocalPath,
                `${APP_NAME.toLowerCase()}/avatars`,
            );

            if (!uploadedAvatar?.secure_url) {
                return res
                    .status(500)
                    .json({ message: "Avatar upload failed" });
            }

            if (user.avatar?.public_id) {
                await deleteFromCloudinary(user.avatar);
            }

            user.avatar = {
                public_id: uploadedAvatar.public_id,
                url: uploadedAvatar.secure_url,
            };
        }

        await user.save();

        return res.status(200).json({
            _id: user._id,
            email: user.email,
            avatar: user.avatar,
        });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: updateProfile ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.avatar?.public_id) {
            await deleteFromCloudinary(user.avatar);
        }

        await user.deleteOne();

        res.clearCookie("jwt", { httpOnly: true, sameSite: "strict" });
        return res.status(200).json({
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: deleteAccount :: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
