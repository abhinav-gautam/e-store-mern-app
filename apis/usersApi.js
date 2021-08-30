const express = require("express")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const multerObj = require("./middlewares/saveImage")
const jwt = require("jsonwebtoken")

const router = express.Router()

let users;

// Get users from the app
router.use((req, res, next) => {
    users = req.app.get("users")
    next()
})

// Register route
router.post("/register", multerObj.single("profilePicture"), asyncHandler(async (req, res) => {
    const newUser = JSON.parse(req.body.user)
    // Checking if username already exists
    const userAlreadyExists = await users.findOne({ username: newUser.username })
    if (userAlreadyExists) {
        throw new Error("user already exists")
    }
    // Generating hash
    const hash = bcrypt.hashSync(newUser.password, 7)
    newUser.password = hash
    newUser.profilePicture = req.file.path
    // Inserting into database
    await users.insertOne(newUser)
    res.status(201).json({
        status: "success",
        message: "user created"
    })
}))

// Login Route
router.post("/login", asyncHandler(async (req, res) => {
    const userCred = req.body
    // Authenticating username
    const userAlreadyExists = await users.findOne({ username: userCred.username })
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