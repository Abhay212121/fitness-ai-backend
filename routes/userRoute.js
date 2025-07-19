const { Router } = require('express')
const { registerUser, userLogin, checkDataOfUser, userProfileData } = require('../controllers/userController')
const verifyToken = require('../middlewares/authMiddleware')

const userRoute = Router()

userRoute.post('/login', userLogin)
userRoute.post('/register', registerUser)
userRoute.get('/check', verifyToken, checkDataOfUser)
userRoute.post('/user-profile', verifyToken, userProfileData)

module.exports = userRoute