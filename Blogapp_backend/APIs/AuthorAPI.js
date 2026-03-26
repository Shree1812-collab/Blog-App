import exp from "express";
import { register } from "../Services/authService.js";
import { UserTypeModel } from "../Models/userModel.js";
import { ArticleModel } from "../Models/articleModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const authorRoute = exp.Router();

// REGISTER AUTHOR (PUBLIC)
authorRoute.post("/users", async (req, res) => {
    try {
        let userObj = req.body;
        // register author
        const newUserObj = await register({ ...userObj, role: "AUTHOR" });
        res.status(201).json({ message: "Author created", payload: newUserObj});
    } catch (err) {
        res.status(500).json({message: "Error creating author", error: err.message });
    }
});


// CREATE ARTICLE (PROTECTED)
authorRoute.post("/articles", verifyToken("AUTHOR"), checkAuthor,async (req, res) => {
        try {
            let articleObj = req.body;

            // attach author id from token
            articleObj.author = req.user.id;

            const articleDoc = new ArticleModel(articleObj);
            const newArticleObj = await articleDoc.save();

            res.status(201).json({ message: "Article created", payload: newArticleObj});

        } catch (err) {
            res.status(500).json({message: "Error creating article", error: err.message });
        }
    }
);


// READ ARTICLES OF AUTHOR (PROTECTED)
authorRoute.get("/articles/:authorId",verifyToken("AUTHOR"),checkAuthor,async (req, res) => {
        try {
            let authorId = req.params.authorId;

            let articles = await ArticleModel.find({ author: authorId, isArticleActive: true }).populate("author", "firstName email");

            res.status(200).json({message: "Articles found",payload: articles});

        } catch (err) {
            res.status(500).json({message: "Error fetching articles",error: err.message});
        }
    }
);


// EDIT ARTICLE (PROTECTED)
authorRoute.put("/articles",verifyToken("AUTHOR"),checkAuthor,async (req, res) => {
        try {
            let articleObj = req.body;
            let articleId = articleObj.articleId;

            // find article
            let article = await ArticleModel.findById(articleId);

            if (!article) {
                return res.status(404).json({
                    message: "Article not found"
                });
            }

            // ensure author owns the article
            if (article.author.toString() !== req.user.id) {
                return res.status(403).json({
                    message: "You are not the owner of this article"
                });
            }

            delete articleObj.articleId;

            let updatedArticle = await ArticleModel.findByIdAndUpdate(articleId,articleObj,{ new: true });

            res.status(200).json({message: "Article updated",payload: updatedArticle});

        } catch (err) {
            res.status(500).json({ message: "Error updating article",error: err.message});
        }
    }
);

// SOFT DELETE ARTICLE (PROTECTED)
authorRoute.patch("/articles/delete",verifyToken("AUTHOR"),checkAuthor,async (req, res) => {
        try {
            let { articleId } = req.body;

            let article = await ArticleModel.findById(articleId);

            if (!article) {
                return res.status(404).json({message: "Article not found"});
            }

            // check ownership
            if (article.author.toString() !== req.user.id) {
                return res.status(403).json({ message: "You are not the owner of this article"});
            }

            // check already deleted
            if (article.isArticleActive === false) {
                return res.status(400).json({message: "Article already deleted"});
            }

            let deletedArticle = await ArticleModel.findByIdAndUpdate(articleId,{ isArticleActive: false },{ new: true } );

            res.status(200).json({message: "Article deleted",payload: deletedArticle});

        } catch (err) {
            res.status(500).json({message: "Error deleting article",error: err.message});
        }
    }
);