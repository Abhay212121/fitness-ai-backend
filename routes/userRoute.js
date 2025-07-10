const { Router } = require('express')
const { registerUser, userLogin } = require('../controllers/userController')

const userRoute = Router()

userRoute.post('/login', userLogin)
userRoute.post('/register', registerUser)

module.exports = userRoute