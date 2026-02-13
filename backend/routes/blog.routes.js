import express from "express";
import {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    deleteBlog,
} from "../controllers/blog.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// POST
router.post("/create", protect, upload.single("image"), createBlog);

// GET
router.get("/", protect, getAllBlogs);
router.get("/:id", protect, getSingleBlog);

// DELETE
router.delete("/:id", protect, deleteBlog);

export default router;
