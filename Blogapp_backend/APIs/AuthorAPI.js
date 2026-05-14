import exp from "express";
import { register } from "../Services/authService.js";
import { UserTypeModel } from "../Models/userModel.js";
import { ArticleModel } from "../Models/articleModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

export const authorRoute = exp.Router();

// REGISTER AUTHOR (PUBLIC)
authorRoute.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {
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
            role: "AUTHOR",
            ...(cloudinaryResult?.secure_url && { profileImageUrl: cloudinaryResult.secure_url }),
        });

        res.status(201).json({ message: "Author created", payload: newUserObj });

    } catch (err) {
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }
        next(err);
    }
});


// CREATE ARTICLE (PROTECTED)
authorRoute.post("/articles", verifyToken("AUTHOR"), checkAuthor, async (req, res, next) => {
    try {
        let articleObj = req.body;

        // attach author id from token
        articleObj.author = req.user.id;

        const articleDoc = new ArticleModel(articleObj);
        const newArticleObj = await articleDoc.save();

        res.status(201).json({ message: "Article created", payload: newArticleObj });

    } catch (err) {
        next(err);
    }
});


// READ ARTICLES OF AUTHOR (PROTECTED)
authorRoute.get("/articles/:authorId", verifyToken("AUTHOR"), checkAuthor, async (req, res, next) => {
    try {
        let authorId = req.params.authorId;

        let articles = await ArticleModel.find({ author: authorId, isArticleActive: true })
            .populate("author", "firstName email");

        res.status(200).json({ message: "Articles found", payload: articles });

    } catch (err) {
        next(err);
    }
});


// EDIT ARTICLE (PROTECTED)
authorRoute.put("/articles", verifyToken("AUTHOR"), checkAuthor, async (req, res, next) => {
    try {
        let articleObj = req.body;
        let articleId = articleObj.articleId;

        let article = await ArticleModel.findById(articleId);

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        if (article.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not the owner of this article" });
        }

        delete articleObj.articleId;

        let updatedArticle = await ArticleModel.findByIdAndUpdate(articleId, articleObj, { new: true });

        res.status(200).json({ message: "Article updated", payload: updatedArticle });

    } catch (err) {
        next(err);
    }
});


// SOFT DELETE ARTICLE (PROTECTED)
authorRoute.patch("/articles/delete", verifyToken("AUTHOR"), checkAuthor, async (req, res, next) => {
    try {
        let { articleId } = req.body;

        let article = await ArticleModel.findById(articleId);

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        if (article.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not the owner of this article" });
        }

        if (article.isArticleActive === false) {
            return res.status(400).json({ message: "Article already deleted" });
        }

        let deletedArticle = await ArticleModel.findByIdAndUpdate(
            articleId,
            { isArticleActive: false },
            { new: true }
        );

        res.status(200).json({ message: "Article deleted", payload: deletedArticle });

    } catch (err) {
        next(err);
    }
});