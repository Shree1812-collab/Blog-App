import { UserTypeModel } from "../Models/userModel.js";
export const checkAuthor = async (req, res, next) => {
    // get author id from params
    let authorId = req.body?.author || req.params.authorId;
    // verify author
    let author = await UserTypeModel.findById(authorId);
    //if author not found
    if (!author) {
        return res.status(401).json({ message: "Invalid author" });
    }
    //if author found but role is different
    if(author.role !== 'AUTHOR'){
        return res.status(403).json({ message:"user is not an author"})
    }
    //if author is blocked
    if(!author.isActive){
        return res.status(403).json({message:"author account is not active"})
    }
    //forward request to next
    next()
};
