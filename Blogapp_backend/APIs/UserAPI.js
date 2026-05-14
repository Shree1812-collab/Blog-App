import exp from "express";
import { register } from "../Services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { ArticleModel } from "../Models/articleModel.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

export const userRoute = exp.Router();

// Register user
userRoute.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {
    let cloudinaryResult;
    try {
        let { firstName, lastName, email, password } = req.body;

        if (req.file) {
            cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        }

        const newUserObj = await register({
            firstName,
            lastName,
            email,
            password,
            role: "USER",
            ...(cloudinaryResult?.secure_url && { profileImageUrl: cloudinaryResult.secure_url }),
        });

        res.status(201).json({ message: "user created", payload: newUserObj });

    } catch (err) {
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }
        next(err);
    }
});

// Get all active articles (Home page/List view)
userRoute.get("/articles", verifyToken("USER"), async (req, res, next) => {
    try {
        let articles = await ArticleModel.find({ isArticleActive: true })
            .populate("comments.user", "firstName email")
            .sort({ createdAt: -1 });
        res.status(200).json({ message: "articles found", payload: articles });
    } catch (err) {
        next(err);
    }
});

// Get single article by ID (Details view)
userRoute.get("/articles/:id", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id)
            .populate("author", "firstName email")
            .populate("comments.user", "firstName email");

        if (!article || !article.isArticleActive) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.status(200).json({ message: "article found", payload: article });
    } catch (err) {
        next(err);
    }
});

// Add comment to article
userRoute.put("/articles", verifyToken("USER"), async (req, res, next) => {
    try {
        const { articleId, comment } = req.body;
        const userId = req.user.id;

        const article = await ArticleModel.findByIdAndUpdate(
            articleId,
            { $push: { comments: { user: userId, comment } } },
            { new: true }
        );

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        const populatedArticle = await article.populate({
            path: "comments.user",
            select: "firstName"
        });

        res.status(200).json({ message: "comment added", payload: populatedArticle });
    } catch (err) {
        next(err);
    }
});