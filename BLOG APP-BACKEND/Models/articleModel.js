import { Schema, model } from "mongoose";

// user comment schema
const userCommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// article schema
const articleSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Author id is mandatory"]
    },
    title: {
      type: String,
      required: [true, "Title is mandatory"]
    },
    category: {
      type: String,
      required: [true, "Category is mandatory"]
    },
    content: {
      type: String,
      required: [true, "Content is mandatory"]
    },
    comments: [userCommentSchema],
    isArticleActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false
  }
);

export const ArticleModel = model("article", articleSchema);
