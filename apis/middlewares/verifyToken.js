const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    // Get token 
    const token = req.headers.authorization.split(" ")[1]

    if (token === "null") {
        throw new Error("token not available")
    }

    const { username } = jwt.verify(token, process.env.SECRET)
    req.username = username
    next()
}

module.exports = verifyToken