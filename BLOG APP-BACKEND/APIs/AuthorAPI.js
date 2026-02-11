import exp from "express";
import { register } from "../Services/authService.js";
import { UserTypeModel } from "../Models/userModel.js";
import { ArticleModel } from "../Models/articleModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const authorRoute = exp.Router();

// register author-public
authorRoute.post("/users", async (req, res) => {
    // get author object from request
    let userObj = req.body;

    // call register service
    const newUserObj = await register({ ...userObj, role: "AUTHOR" });

    // send response
    res.status(201).json({message: "author created",payload: newUserObj});
});

// // authenticate author-public
// authorRoute.post("/authenticate", async (req, res) => {
//     // get author credentials
//     let userCred = req.body;

//     // call authenticate service
//     let { token, user } = await authenticate(userCred);

//     // store token in cookie
//     res.cookie("token", token, { httpOnly: true});

//     // send response
//     res.status(200).json({message: "login success",payload: user});
// });

//create article-protected
authorRoute.post('/articles',verifyToken,checkAuthor,async(req,res)=>{
    //get article from req
    let articleObj = req.body;

    //create article doc
    const articleDoc = new ArticleModel(articleObj);

    //save
    const newArticleObj = await articleDoc.save();

    //send response
    res.status(201).json({message: "article created",payload: newArticleObj});
})

// read articles of author-protected
authorRoute.get("/articles/:authorId",verifyToken,checkAuthor,async (req, res) => {
        // get author id
        let authorId = req.params.authorId;

        // read articles by this author
        let articles = await ArticleModel.find({author: authorId,isArticleActive: true}).populate("author","firstName email");

        // send response
        res.status(200).json({message: "article found",payload: articles});
    }
);

// edit article-protected
authorRoute.put("/articles",verifyToken,checkAuthor, async (req, res) => {
    // get article data from request
    let articleObj = req.body;

    // extract articleId
    let articleId = articleObj.articleId;

    // remove articleId from object (not in schema)
    delete articleObj.articleId;

    // update article
    let updatedArticle = await ArticleModel.findByIdAndUpdate(articleId,articleObj,{ new: true });

    // send response
    res.status(200).json({message: "article updated",payload: updatedArticle});
});

// soft delete article-protected
authorRoute.put("/articles/delete", async (req, res) => {
    // get article id from request
    let articleObj = req.body;

    // update article status to inactive
    let deletedArticle = await ArticleModel.findByIdAndUpdate(articleObj.articleId,{ isArticleActive: false },{ new: true });

    // send response
    res.status(200).json({ message: "article deleted",payload: deletedArticle});
});
