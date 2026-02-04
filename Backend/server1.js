import exp from "express";
import { userApp } from "./APIs/userAPI.js";
import { productApp } from "./APIs/productAPI.js";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";

const app = exp();
const port = 4000;

// body parser middleware (ALWAYS before routes)
app.use(exp.json());
//adding cookie parser middleware
app.use(cookieParser())
// if path starts with /user-api,/product-api forward req to userApp
app.use("/user-api", userApp);
app.use("/product-api",productApp)
// connect to db server and then start server
async function connectDB() {
  try {
    await connect("mongodb://localhost:27017/mydb");
    console.log("DB connection success");

    app.listen(port, () =>
      console.log(`Server listening on port ${port}...`)
    );
  } catch (err) {
    console.error("DB connection failed", err);
  }
}

connectDB();

//error handling middleware
function errorHandler(err,req,res,next){
  res.json({message:"error",reason:err.message})
}
app.use(errorHandler)

