import {Schema,model} from 'mongoose'
//create product schema
const productSchema=new Schema({
    pid:{
        type:Number,
        required:[true,"pid is required"]
    },
    productName:{
        type:String,
        required:[true,"product name is required"],
        minLength:[5,"Min length should be four"],
        maxLength:[20,"Max length should be six"]
    },
    price:{
        type:Number,
        required:[true,"price is required"]
    },
},{
    strict:"throw",
    timestamps:true
});
//create product model with that schema
export const ProductModel=model("product",productSchema)