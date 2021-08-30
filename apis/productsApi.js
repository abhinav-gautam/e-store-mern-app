const express = require("express")
const asyncHandler = require("express-async-handler")
const multerObj = require("./middlewares/saveImage")
const verifyToken = require("./middlewares/verifyToken")
const ObjectId = require("mongodb").ObjectId

const router = express.Router()

let products;

// Get products from the app
router.use((req, res, next) => {
    products = req.app.get("products")
    next()
})

// Route to add a product
router.post("/addProduct", verifyToken, multerObj.single("productImage"), asyncHandler(async (req, res) => {
    const product = JSON.parse(req.body.product)
    product.productImage = req.file.path
    await products.insertOne(product)
    res.status(201).json({
        status: "success",
        message: "product added",
        product
    })
}))

// Route to get all the products
router.get("/getProducts", asyncHandler(async (req, res) => {
    const productsList = await products.find().toArray()
    res.status(200).json({
        status: "success",
        message: "all products",
        productsList
    })
}))

// Route to delete product by id
router.delete("/deleteProduct/:id", verifyToken, asyncHandler(async (req, res) => {
    await products.deleteOne({ _id: new ObjectId(req.params.id) })
    res.status(200).json({
        status: "success",
        message: "product deleted",
    })
}))

// Route to edit product by id
router.put("/editProduct/:id", verifyToken, multerObj.single("productImage"), asyncHandler(async (req, res) => {
    const product = JSON.parse(req.body.product)
    product.productImage = req.file.path
    delete product._id
    const id = req.params.id
    await products.updateOne({ _id: new ObjectId(id) }, { $set: product })
    res.status(201).json({
        status: "success",
        message: "product updated",
        product: { ...product, _id: id }
    })
}))
module.exports = router