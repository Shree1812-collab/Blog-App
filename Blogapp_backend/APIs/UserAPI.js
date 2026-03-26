import exp from "express";
import { register } from "../Services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { ArticleModel } from "../Models/articleModel.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js"; 

export const userRoute = exp.Router();

// Register user
userRoute.post("/users", upload.single("profileImageUrl"),async (req, res, next) => {
        let cloudinaryResult;
          try {
              let userObj = req.body;
                //  Step 1: upload image to cloudinary from memoryStorage (if exists)
                if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
                }

                // Step 2: call existing register()
                const newUserObj = await register({
                ...userObj,
                role: "USER",
                profileImageUrl: cloudinaryResult?.secure_url,
                });

                res.status(201).json({message: "user created", payload: newUserObj,});

            } catch (err) {

                // Step 3: rollback 
                if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
                }

                next(err); // send to your error middleware
            }

        }
        );

// Get all active articles
userRoute.get("/articles", verifyToken("USER"), async (req, res, next) => {
  try {
    let articles = await ArticleModel.find({ isArticleActive: true })
      .populate("author", "firstName email")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "articles found", payload: articles });
  } catch (err) {
    next(err);
  }
});

// FIX: Added single article fetch — needed when user navigates directly to /article/:id
userRoute.get("/articles/:id", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id)
      .populate("author", "firstName email");

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

    // FIX: Use req.user.id from token instead of trusting client-supplied user field
    const userId = req.user.id;

    const articleWithComment = await ArticleModel.findByIdAndUpdate(
      articleId,
      { $push: { comments: { user: userId, comment } } },
      { new: true, runValidators: true }
    );

    if (!articleWithComment) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "comment added", payload: articleWithComment });
  } catch (err) {
    next(err);
  }
});