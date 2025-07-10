require('dotenv').config()
const { Client } = require('pg')

const createUserSql = `
CREATE TABLE IF NOT EXISTS users(
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_name VARCHAR (255),
    user_mail VARCHAR (255),
    user_password VARCHAR (255)
)
`

async function main() {
    console.log('Sending...')
    const client = new Client({
        connectionString: process.env.CONNECTION_STRING
    })
    await client.connect()
    await client.query(createUserSql)
    await client.end()
    console.log('Done!')
}

main()