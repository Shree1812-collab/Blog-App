import exp from "express";
import bcrypt from "bcryptjs";
import { login } from "../Services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserTypeModel } from "../Models/userModel.js";

export const commonRouter = exp.Router();

// Login
commonRouter.post("/login", async (req, res, next) => {
  try {
    const { token, user } = await login(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // required for HTTPS
      sameSite: "none",    // required for cross-domain cookies
    });
    res.status(200).json({ message: "login success", payload: user });
  } catch (err) {
    next(err);
  }
});

// are all available in currentUser after a page refresh
commonRouter.get(
  "/check-auth",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res, next) => {
    try {
      // req.user only has id/role/email from the token — fetch the real document
      const user = await UserTypeModel.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      res.status(200).json({ message: "authenticated", payload: user });
    } catch (err) {
      next(err);
    }
  }
);

// Logout
commonRouter.get("/logout", (req, res) => {
  res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});
  res.status(200).json({ message: "logged out!" });
});

// Change password — protected
commonRouter.put(
  "/change-password",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res, next) => {
    try {
      const { email, currentPassword, newPassword } = req.body;
      if (req.user.email !== email) {
        return res.status(403).json({ message: "Cannot change another user's password" });
      }
      const user = await UserTypeModel.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

      user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
      await user.save();
      res.json({ message: "Password changed successfully" });
    } catch (err) {
      next(err);
    }
  }
);