import exp from "express";
import { ProductModel } from "../models/productModel.js";

export const productApp = exp.Router();

// CREATE product
productApp.post("/products", async (req, res) => {
  let newProduct = req.body;
  let newProductDoc = new ProductModel(newProduct);
  await newProductDoc.save();

  res.status(201).json({ message: "product created" });
});

// READ all products
productApp.get("/products", async (req, res) => {
  let products = await ProductModel.find();

  res.status(200).json({
    message: "products",
    payload: products,
  });
});

// READ product by id
productApp.get("/products/:id", async (req, res) => {
  let objId = req.params.id;
  let productObj = await ProductModel.findById(objId);

  res.status(200).json({
    message: "product",
    payload: productObj,
  });
});

// UPDATE product
productApp.put("/products/:id", async (req, res) => {
  let objId = req.params.id;
  let modifiedProduct = req.body;

  let latestProduct = await ProductModel.findByIdAndUpdate(
    objId,
    { $set: { ...modifiedProduct } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: "product modified",
    payload: latestProduct,
  });
});

// DELETE product
productApp.delete("/products/:id", async (req, res) => {
  let objId = req.params.id;
  let deletedProduct = await ProductModel.findByIdAndDelete(objId);

  res.status(200).json({
    message: "product deleted",
    payload: deletedProduct,
  });
});
