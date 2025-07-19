const pool = require('./pool')

const findUserByEmail = async (email) => {
    const { rows } = await pool.query(`SELECT * FROM users WHERE user_mail = $1`, [email])
    return rows[0]
}

const addUserInDb = async (fullname, email, password) => {
    await pool.query(`INSERT INTO users(user_name,user_mail,user_password) VALUES($1,$2,$3)`, [fullname, email, password])
}

const userAndProfile = async (user_id) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM users LEFT JOIN user_profiles ON users.user_id = user_profiles.user_id WHERE users.user_id = $1`, [user_id])
        return rows[0]
    } catch (error) {
        console.log(error)
    }
}

const addUserProfile = async (user_id, formData) => {
    console.log(formData)
    const { fullName, age, gender, heightFeet, heightInches, weight, targetWeight, timeline, dietType, foodDislikes, favoritefoods, allergies, equipmentAvailable, gymAccess, occupationType, preferredWorkouts, workoutLevel, workoutTime, weeklyActivity, fitnessGoal, stressLevel } = formData.formData
    try {
        await pool.query(`INSERT INTO user_profiles(user_id,fullname,age,gender,heightfeet,heightinches,weight,targetweight,timeline,diettype,fooddislikes,favoritefoods,allergies,equipmentavailable,gymaccess,occupationtype,preferredworkouts,workoutlevel,workouttime,weeklyactivity,fitnessgoal,stresslevel) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)`, [user_id, fullName, age, gender, heightFeet, heightInches, weight, targetWeight, timeline, dietType, foodDislikes?.join(', '), favoritefoods?.join(', '), allergies?.join(', '), equipmentAvailable?.join(', '), gymAccess, occupationType, preferredWorkouts?.join(', '), workoutLevel, workoutTime, weeklyActivity, fitnessGoal, stressLevel])
    } catch (error) {
        console.log(error.message)
    }
}

const addSleepRecord = async (user_id, bedTime, wakeTime, quality, hours, notes) => {
    try {
        await pool.query(`INSERT INTO sleep_data(user_id,bedtime,waketime,quality,hours,notes) VALUES($1,$2,$3,$4,$5,$6)`, [user_id, bedTime, wakeTime, quality, hours, notes])
    } catch (error) {
        console.log(error.message)
    }
}

const addMoodRecord = async (user_id, rating, emotions, energy, stress, notes) => {
    try {
        await pool.query(`INSERT INTO mood_data(user_id,rating,emotions,energy,stress,notes) VALUES($1,$2,$3,$4,$5,$6)`, [user_id, rating, emotions, energy, stress, notes])
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = { findUserByEmail, addUserInDb, userAndProfile, addUserProfile, addSleepRecord, addMoodRecord }