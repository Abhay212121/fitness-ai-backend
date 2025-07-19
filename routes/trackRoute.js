const { Router } = require('express')
const { postSleepData, postMoodData } = require('../controllers/trackController')
const verifyToken = require('../middlewares/authMiddleware')

const trackRoute = Router()

trackRoute.post('/sleep', verifyToken, postSleepData)
trackRoute.post('/mood', verifyToken, postMoodData)

module.exports = trackRoute