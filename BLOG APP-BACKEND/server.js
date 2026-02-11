import exp from 'express'
import {connect} from 'mongoose'
import { config } from 'dotenv'
import { userRoute } from './APIs/UserAPI.js'
import { authorRoute } from './APIs/AuthorAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
import cookieParser from 'cookie-parser'
import { commonRouter } from './APIs/commonAPI.js'
config()    //process.env
//create express app
const app=exp()
//add body parser middleware
app.use(exp.json())
//add cookie parser middleware
app.use(cookieParser())
//connect apis
app.use('/user-api',userRoute)
app.use('/author-api',authorRoute)
app.use('/admin-api',adminRoute)
app.use('/common-api',commonRouter)

//connect to db
const connectDB=async()=>{
    try{
    await connect(process.env.DB_URL)
    console.log("Connected to DB...")
    app.listen(process.env.PORT,()=>console.log("Server started..."))
    }catch(err){
        console.log("Err in DB",err)
    }
}
connectDB()

//dealing with invalid path
app.use((req,res,next )=>{
    console.log(req.url)
    res.json({message:`${req.url}  is invalid path`})
})
//error handling middleware
app.use((err,req,res,next)=>{
    console.log("err:",err)
    res.json({message:"error",reason:err.message})
})
