import exp from 'express'
import { UserTypeModel } from '../Models/userModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'

export const adminRoute = exp.Router()

// Get all users (needed for AdminDashboard)
adminRoute.get("/admin/users", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const users = await UserTypeModel.find({}, { password: 0 }) // exclude passwords
    res.json({ message: "Users fetched", payload: users })
  } catch (err) {
    next(err)
  }
})

// Block user
adminRoute.post("/admin/block-user/:userId", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const blockedUser = await UserTypeModel.findByIdAndUpdate(
      req.params.userId,
      { isActive: false },
      { new: true }
    )
    if (!blockedUser) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ message: "User blocked successfully" })
  } catch (err) {
    next(err)
  }
})

// Unblock user
adminRoute.post("/admin/unblock-user/:userId", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const unblockedUser = await UserTypeModel.findByIdAndUpdate(
      req.params.userId,
      { isActive: true },
      { new: true }
    )
    if (!unblockedUser) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ message: "User unblocked successfully" })
  } catch (err) {
    next(err)
  }
})