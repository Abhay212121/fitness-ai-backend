const { Router } = require('express')
const { postSleepData, postMoodData, postWorkoutData, saveTemplate } = require('../controllers/trackController')
const verifyToken = require('../middlewares/authMiddleware')

const trackRoute = Router()

trackRoute.post('/sleep', verifyToken, postSleepData)
trackRoute.post('/mood', verifyToken, postMoodData)
trackRoute.post('/workout', verifyToken, postWorkoutData)
trackRoute.post('/savetemplate', verifyToken, saveTemplate)

module.exports = trackRoute