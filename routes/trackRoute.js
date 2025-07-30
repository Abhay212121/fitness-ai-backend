const { Router } = require('express')
const { postSleepData, postMoodData, postWorkoutData, saveTemplate, getTemplates, getHistory } = require('../controllers/trackController')
const verifyToken = require('../middlewares/authMiddleware')

const trackRoute = Router()

trackRoute.post('/sleep', verifyToken, postSleepData)
trackRoute.post('/mood', verifyToken, postMoodData)
trackRoute.post('/workout', verifyToken, postWorkoutData)
trackRoute.post('/savetemplate', verifyToken, saveTemplate)
trackRoute.get('/gettemplates', verifyToken, getTemplates)
trackRoute.get('/gethistory', verifyToken, getHistory)

module.exports = trackRoute