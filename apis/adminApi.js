const express = require("express")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const router = express.Router()

let admin;

// Get admin from the app
router.use((req, res, next) => {
    admin = req.app.get("admin")
    next()
})

// Login Route
router.post("/login", asyncHandler(async (req, res) => {
    const userCred = req.body
    // Authenticating username
    const userAlreadyExists = await admin.findOne({ username: userCred.username })
    if (!userAlreadyExists) {
        throw new Error("invalid username")
    }
    // Authenticating password
    const isPasswordOk = bcrypt.compareSync(userCred.password, userAlreadyExists.password)
    if (!isPasswordOk) {
        throw new Error("invalid password")
    }
    // Generating token
    const signedToken = jwt.sign({ username: userCred.username }, process.env.SECRET, { expiresIn: "10d" })
    res.status(200).json({
        status: "success",
        token: signedToken,
        user: userAlreadyExists
    })
}))


module.exports = router