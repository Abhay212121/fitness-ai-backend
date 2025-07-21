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

module.exports = { postSleepData, postMoodData, postWorkoutData }