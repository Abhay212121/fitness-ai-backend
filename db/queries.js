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

const getTemplates = async (userId) => {
    const templatesRes = await pool.query(
        `SELECT * FROM templates WHERE user_id = $1`,
        [userId]
    );

    const templates = [];

    for (const template of templatesRes.rows) {
        const exercisesRes = await pool.query(
            `SELECT * FROM template_exercise WHERE template_id = $1`,
            [template.template_id]
        );

        const exercises = [];

        for (const exercise of exercisesRes.rows) {
            const setsRes = await pool.query(
                `SELECT weight, reps_count FROM template_set WHERE template_exercise_id = $1`,
                [exercise.template_exercise_id]
            );

            const sets = setsRes.rows.map(set => ({
                weight: set.weight,
                reps: set.reps_count,
                completed: false,
            }));

            exercises.push({
                id: exercise.template_exercise_id.toString(),
                name: exercise.exercise_name,
                sets,
            });
        }

        templates.push({
            id: template.template_id.toString(),
            name: template.template_name,
            exercises,
            createdAt: template.created_at,
        });
    }

    return templates;
};

const getHistory = async (userId) => {
    try {
        const workoutsRes = await pool.query(
            `SELECT * FROM workout_data WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        const history = [];

        for (const workout of workoutsRes.rows) {
            const exercisesRes = await pool.query(
                `SELECT * FROM exercise_data WHERE workout_id = $1`,
                [workout.workout_id]
            );

            const exercises = [];

            for (const exercise of exercisesRes.rows) {
                const setsRes = await pool.query(
                    `SELECT * FROM set_data WHERE exercise_id = $1`,
                    [exercise.exercise_id]
                );

                const sets = setsRes.rows.map(set => ({
                    weight: set.weight,
                    reps: set.reps_count,
                    completed: set.completed ?? true,
                }));

                exercises.push({
                    id: exercise.exercise_id.toString(),
                    name: exercise.exercise_name,
                    sets,
                });
            }

            history.push({
                id: workout.workout_id.toString(),
                name: workout.workout_name,
                notes: workout.workout_note,
                date: workout.created_at,
                exercises,
            });
        }

        return history;
    } catch (error) {
        console.error("Error fetching workout history:", error.message);
        throw error;
    }
};


module.exports = { findUserByEmail, addUserInDb, userAndProfile, addUserProfile, addSleepRecord, addMoodRecord, addWorkoutRecord, addNewTemplate, getTemplates, getHistory }