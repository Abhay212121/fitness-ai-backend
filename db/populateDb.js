require('dotenv').config()
const { Client } = require('pg')

const createUserSql = `
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users(
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_name VARCHAR (255),
    user_mail VARCHAR (255),
    user_password VARCHAR (255)
)
`
const userDetailsSQL = `
  DROP TABLE IF EXISTS user_profiles;

  CREATE TABLE IF NOT EXISTS user_profiles (
    profile_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    fullname VARCHAR(100),
    age INTEGER,
    gender TEXT,  
    heightfeet INTEGER,
    heightinches INTEGER,
    weight REAL,
    targetweight REAL,
    timeline TEXT,
    diettype TEXT,
    fooddislikes TEXT,         
    favoritefoods TEXT,      
    allergies TEXT,            
    equipmentavailable TEXT,   
    gymaccess TEXT,             
    occupationtype TEXT,
    preferredworkouts TEXT,    
    workoutlevel TEXT,
    workouttime TEXT,
    weeklyactivity TEXT,
    fitnessgoal TEXT,
    stresslevel TEXT,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

const sleepTableSQL = `
DROP TABLE IF EXISTS sleep_data;
CREATE TABLE IF NOT EXISTS sleep_data(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER REFERENCES users(user_id),
  bedTime TEXT,
  wakeTime TEXT,
  quality INTEGER,
  hours REAL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
)
`
const moodTableSQL = `
DROP TABLE IF EXISTS mood_data;
CREATE TABLE IF NOT EXISTS mood_data(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER REFERENCES users(user_id),
  rating INTEGER,
  emotions TEXT,
  energy TEXT,
  stress TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
)
`

const workoutTableSQL = `
DROP TABLE IF EXISTS workout_data;
CREATE TABLE IF NOT EXISTS workout_data(
  workout_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER REFERENCES users(user_id),
  workout_name TEXT,
  workout_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `
const exerciseTableSQL = `
  DROP TABLE IF EXISTS exercise_data;
  CREATE TABLE IF NOT EXISTS exercise_data(
  exercise_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  workout_id INTEGER REFERENCES workout_data(workout_id) ON DELETE CASCADE,
  exercise_name TEXT
);
`
const setTableSQL = `
DROP TABLE IF EXISTS set_data;
CREATE TABLE IF NOT EXISTS set_data(
  set_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  exercise_id INTEGER REFERENCES exercise_data(exercise_id) ON DELETE CASCADE,
  weight REAL,
  reps_count INTEGER
);
`


async function main() {
  console.log('Sending...')
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING
  })
  await client.connect()
  await client.query(workoutTableSQL)
  await client.query(exerciseTableSQL)
  await client.query(setTableSQL)
  // await client.query(moodTableSQL)
  // await client.query(`DROP TABLE IF EXISTS users`)
  // await client.query(`DROP TABLE IF EXISTS user_profiles`)
  await client.end()
  console.log('Done!')
}

main()