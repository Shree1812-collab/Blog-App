import {Schema,model} from 'mongoose'
//create user schema
const userSchema=new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        minLength:[4,"Min length should be four"],
        maxLength:[6,"Max length should be six"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    age:{
        type:Number,
        required:[true,"age is required"],
        min:[18,"Age should be above 18"],
        max:[25,"Age should be less than 25"]
    },
},{
    strict:"throw",
    timestamps:true
});
//create user model with that schema
export const UserModel=model("user",userSchema)