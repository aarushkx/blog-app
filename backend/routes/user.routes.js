import express from "express";
import {
    updateProfile,
    deleteAccount,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// PUT
router.put("/profile", protect, upload.single("avatar"), updateProfile);

// DELETE
router.delete("/profile", protect, deleteAccount);

export default router;
