import exp from "express";
import { register } from "../Services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { ArticleModel } from "../Models/articleModel.js";

export const userRoute = exp.Router();

// register user
userRoute.post("/users", async (req, res) => {
    // get user object from request
    let userObj = req.body;

    // call register service
    const newUserObj = await register({ ...userObj, role: "USER" });

    // send response
    res.status(201).json({message: "user created",payload: newUserObj});
});

// // authenticate user
// userRoute.post("/authenticate", async (req, res) => {
//     // get user credentials
//     let userCred = req.body;

//     // call authenticate service
//     let { token, user } = await authenticate(userCred);

//     // store token in cookie
//     res.cookie("token", token, { httpOnly: true });

//     // send response
//     res.status(200).json({message: "login success",payload: user});
// });

// read all articles (protected)
userRoute.get("/articles", verifyToken, async (req, res) => {
    // read only active articles
    let articles = await ArticleModel.find({ isArticleActive: true });
    // send response
    res.status(200).json({message: "articles found",payload: articles});
});

// add comment to article (protected)
userRoute.post("/articles/:articleId",verifyToken,async (req, res) => {
    const { articleId } = req.params;
    const { comment } = req.body;
    const updatedArticle = await ArticleModel.findByIdAndUpdate(articleId,
      {
        $push: {
          comments: {
            user: req.user.id,
            comment: comment
          }
        }
      },
      { new: true }
    ).populate("comments.user", "firstName email");

    res.status(201).json({message: "comment added",payload: updatedArticle});
  }
);
