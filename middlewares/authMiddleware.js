const dotenv = require('dotenv')
dotenv.config()
const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    if (!token) {
        return res.json({ msg: 'Access denied as no token found!' })
    }
    try {
        const decoded = jwt.verify(token, process.env.MY_SECRET_KEY)
        req.user_id = decoded.user_id
        next()
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }

}

module.exports = verifyToken