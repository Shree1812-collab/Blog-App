import exp from "express";
import { UserModel } from "../models/usermodel.js";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/verifyToken.js";

export const userApp = exp.Router();

// create user
userApp.post("/users", async (req, res) => {
  let newUser = req.body;

  let hashedPassword = await hash(newUser.password, 12);
  newUser.password = hashedPassword;

  let newUserDoc = UserModel(newUser);
  await newUserDoc.save();

  res.status(201).json({ message: "user created" });
});

// login
userApp.post("/auth", async (req, res) => {
  let userCred = req.body;

  let userOfDB = await UserModel.findOne({ username: userCred.username });
  if (userOfDB === null) {
    return res.status(404).json({ message: "invalid username" });
  }

  let status = await compare(userCred.password, userOfDB.password);
  if (status === false) {
    return res.status(404).json({ message: "authentication failed" });
  }

  let signedToken = jwt.sign(
    { username: userCred.username },
    "abcdef",
    { expiresIn: "1h" }
  );

  res.cookie("token", signedToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({ message: "login success", token: signedToken });
});

// read users
userApp.get("/users", async (req, res) => {
  let users = await UserModel.find();
  res.status(200).json({ message: "users", payload: users });
});

// read user by id
userApp.get("/users/:id", async (req, res) => {
  let userObj = await UserModel.findById(req.params.id);
  res.status(200).json({ message: "user", payload: userObj });
});

// update user
userApp.put("/users/:id", async (req, res) => {
  let latestUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.status(200).json({ message: "user modified", payload: latestUser });
});

// delete user
userApp.delete("/users/:id", async (req, res) => {
  let deletedUser = await UserModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "user deleted", payload: deletedUser });
});

// protected test route
userApp.get("/test", verifyToken, (req, res) => {
  res.json({ message: "test route"});
});
