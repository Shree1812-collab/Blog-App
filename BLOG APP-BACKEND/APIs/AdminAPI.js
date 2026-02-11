import exp from 'express'
import { UserTypeModel } from '../Models/userModel.js'
export const adminRoute=exp.Router()

// block users
adminRoute.post("/admin/block-user/:userId", async (req,res)=>{
    const blockedUser = await UserTypeModel.findByIdAndUpdate(
      req.params.userId,
      {isActive:false},
      {new:true}
    );
    if(!blockedUser){
      return res.status(404).json({message:"User not found"})
    }
    res.json({ message:"User blocked successfully"})
})
// unblock user 
adminRoute.post("/admin/unblock-user/:userId",async (req,res)=>{
    const unblockedUser=await UserTypeModel.findByIdAndUpdate(
        req.params.userId,
        {isActive:true},
        {new:true}
    )
    if(!unblockedUser){
        return res.status(404).json({message:"User found"})
    }
    res.json({message:"User unblocked successfully"})
})














