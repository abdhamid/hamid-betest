const jwt = require("jsonwebtoken")
const user = require("../models/user")

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            message: "Access denied"
        })
    } else {
        jwt.verify(token, process.env.API_SECRET, function(err, decode) {
            if(err) {
                return res.status(403).json({
                    message: "Forbidden"
                })
            }
            req.user = user
            next()
        })
    }
}

module.exports = verifyToken
