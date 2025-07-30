const db = require('../db/queries')

const postSleepData = async (req, res) => {
    console.log(req.body.sleepForm)
    const userId = req.user_id
    const { bedTime, wakeTime, quality, hours, notes } = req.body.sleepForm
    try {
        await db.addSleepRecord(userId, bedTime, wakeTime, quality, hours, notes)
        return res.json({ status: 200, msg: 'Record Added!' })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

const postMoodData = async (req, res) => {
    const userId = req.user_id
    const { rating, emotions, energy, stress, notes } = req.body.moodForm
    try {
        await db.addMoodRecord(userId, rating, emotions, energy, stress, notes)
        return res.json({ status: 200, msg: 'Record Added!' })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

const postWorkoutData = async (req, res) => {
    const workoutName = req.body.workoutName;
    const workoutNotes = req.body.workoutNotes;
    const exerciseData = req.body.currentWorkout;
    const userId = req.user_id
    try {
        await db.addWorkoutRecord(userId, workoutName, workoutNotes, exerciseData)
        return res.json({ status: 200, msg: 'Done!' })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

const saveTemplate = async (req, res) => {
    const workoutName = req.body.workoutName;
    const templateName = req.body.templateName;
    const exerciseData = req.body.currentWorkout;
    const userId = req.user_id
    console.log(workoutName, templateName, exerciseData, userId)
    try {
        await db.addNewTemplate(userId, exerciseData, templateName, workoutName)
        return res.json({ status: 200, msg: 'Template added!' })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

const getTemplates = async (req, res) => {
    const userId = req.user_id;
    try {
        const templates = await db.getTemplates(userId)
        return res.json({ status: 200, msg: 'Templates fetched', data: templates })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

const getHistory = async (req, res) => {
    const userId = req.user_id
    try {
        const history = await db.getHistory(userId)
        return res.json({ status: 200, msg: 'History fetched', data: history })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
module.exports = { postSleepData, postMoodData, postWorkoutData, saveTemplate, getTemplates, getHistory }