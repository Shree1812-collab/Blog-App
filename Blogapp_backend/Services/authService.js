import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../Models/userModel.js";
import {config} from 'dotenv'
config();

// register
export const register = async (userObj) => {
    const userDoc = new UserTypeModel(userObj);

    // validate
    await userDoc.validate();

    // hash password
    userDoc.password = await bcrypt.hash(userDoc.password, 10);

    // save
    const created = await userDoc.save();

    // remove password before returning
    const newUserObj = created.toObject();
    delete newUserObj.password;

    return newUserObj;
};

// login/authenticate
export const login = async ({ email, password }) => {
    const user = await UserTypeModel.findOne({ email });
    if (!user) {
        const err = new Error("Invalid email");
        err.status = 401;
        throw err;
    }

    // password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const err = new Error("Invalid password");
        err.status = 401;
        throw err;
    }

     // check isActive state
    if (user.isActive === false) {
        const err = new Error("Account blocked. Contact admin.");
        err.status = 403;
        throw err;
    }

    
    // generate jwt
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    const userObj = user.toObject();
    delete userObj.password;

    return { token, user: userObj };
};
