import { UserTypeModel } from "../Models/userModel.js";

export const checkAuthor = async (req, res, next) => {
  try {

    // get logged-in user from JWT middleware
    const authorId = req.user.id;

    const author = await UserTypeModel.findById(authorId);

    if (!author) {
      return res.status(401).json({
        message: "Invalid author"
      });
    }

    if (author.role !== "AUTHOR") {
      return res.status(403).json({
        message: "User is not an author"
      });
    }

    if (!author.isActive) {
      return res.status(403).json({
        message: "Author account is not active"
      });
    }

    next();

  } catch (err) {
    next(err);
  }
};