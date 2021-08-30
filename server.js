const express = require("express")
const morgan = require("morgan")
const mongoClient = require("mongodb").MongoClient
const usersApi = require("./apis/usersApi")
const cartApi = require("./apis/cartApi")
const adminApi = require("./apis/adminApi")
const productsApi = require("./apis/productsApi")
require("dotenv").config()

// Express app
const app = express()

// React app connection
app.use(express.static(`${__dirname}/estore_frontend/build`))

// Logging
app.use(morgan("dev"))

// Body Parser
app.use(express.json())

// MongoDB Connection
const DATABASE_URL = process.env.DATABASE_URL;
(async () => {
    const client = await mongoClient.connect(DATABASE_URL)

    // Get db object
    const estoreDb = client.db("estoreDb")

    // Get collections object
    const users = estoreDb.collection("usersCollection")
    const products = estoreDb.collection("productsCollection")
    const admin = estoreDb.collection("adminCollection")
    const cart = estoreDb.collection("cartCollection")

    // Set to app object
    app.set("users", users)
    app.set("products", products)
    app.set("admin", admin)
    app.set("cart", cart)

    console.log("[+] Database Connected");
})()

// Users Api
app.use("/users", usersApi)
app.use("/cart", cartApi)
app.use("/admin", adminApi)
app.use("/products", productsApi)


// Error Handler Route
app.use((err, req, res, next) => {
    console.log("[-] Error: ", err.message);
    res.status(200).json({
        status: "failed",
        message: err.message
    })
})

// Default path
app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/estore_frontend/build/index.html`)
})


// Express app listening
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`[+] Server started on port ${PORT}`);
})