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

const addWorkoutRecord = async (userId, workoutName, workoutNotes, exerciseData) => {
    try {

        const workoutRes = await pool.query(`INSERT INTO workout_data(user_id,workout_name,workout_note) VALUES ($1,$2,$3) RETURNING workout_id`, [userId, workoutName, workoutNotes])
        const workoutId = workoutRes.rows[0].workout_id;

        for (const exercise of exerciseData) {
            const exerciseRes = await pool.query(
                `INSERT INTO exercise_data(workout_id, exercise_name) VALUES ($1, $2) RETURNING exercise_id`,
                [workoutId, exercise.name]
            );

            const exerciseId = exerciseRes.rows[0].exercise_id;

            for (const set of exercise.sets) {
                await pool.query(
                    `INSERT INTO set_data(exercise_id, weight, reps_count) VALUES ($1, $2, $3)`,
                    [exerciseId, set.weight, set.reps]
                );
            }
        }

        console.log('Workout data entered!')
    } catch (error) {
        console.log(error.message)
    }
}

const addNewTemplate = async (userId, exercises, templateName, workoutName) => {
    try {
        // Step 1: Insert into templates
        const templateRes = await pool.query(
            `INSERT INTO templates (user_id, template_name) VALUES ($1, $2) RETURNING template_id`,
            [userId, templateName]
        );
        const templateId = templateRes.rows[0].template_id;

        // Step 2: Loop through each exercise
        for (const exercise of exercises) {
            const exerciseRes = await pool.query(
                `INSERT INTO template_exercise(template_id, exercise_name) VALUES ($1, $2) RETURNING template_exercise_id`,
                [templateId, exercise.name]
            );
            const templateExerciseId = exerciseRes.rows[0].template_exercise_id;

            // Step 3: Insert each set for the exercise
            for (const set of exercise.sets) {
                await pool.query(
                    `INSERT INTO template_set(template_exercise_id, weight, reps_count) VALUES ($1, $2, $3)`,
                    [templateExerciseId, set.weight, set.reps]
                );
            }
        }

        console.log("Template saved successfully!");
    } catch (err) {
        console.error("Error saving template:", err.message);
        throw err;
    }
};


module.exports = { findUserByEmail, addUserInDb, userAndProfile, addUserProfile, addSleepRecord, addMoodRecord, addWorkoutRecord, addNewTemplate }