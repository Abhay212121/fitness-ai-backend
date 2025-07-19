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

// CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE

async function main() {
  console.log('Sending...')
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING
  })
  await client.connect()
  await client.query(createUserSql)
  await client.query(userDetailsSQL)
  // await client.query(`DROP TABLE IF EXISTS users`)
  // await client.query(`DROP TABLE IF EXISTS user_profiles`)
  await client.end()
  console.log('Done!')
}

main()