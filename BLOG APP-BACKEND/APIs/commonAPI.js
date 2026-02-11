import exp from "express";
import bcrypt from "bcryptjs";
import { login } from "../Services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserTypeModel } from "../Models/userModel.js";

export const commonRouter = exp.Router();

// login
commonRouter.post("/login", async (req, res) => {
  // get user credentials
  let userCred = req.body;

  // authenticate
  let { token, user } = await login(userCred);

  // store token in cookie
  res.cookie("token", token, { httpOnly: true });

  // send response
  res.status(200).json({ message: "login success", payload: user });
});

// logout
commonRouter.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  });
  res.status(200).json({ message: "logged out!" });
});

// change password
commonRouter.put("/change-password", async (req, res) => {
  // get passwords from request
  const {email, currentPassword, newPassword } = req.body;

  // find user
  const user = await UserTypeModel.findOne({email});
  const isMatch=await bcrypt.compare(
    currentPassword,
    user.password
  )

  if (!isMatch) {
        return res.status(401).json({
            message: "Current password is incorrect"
        });
    }
    //replace the current password with new password
     const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save()
    //send res
     res.json({ message: "Password changed successfully" });
});
