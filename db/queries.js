const pool = require('./pool')

const findUserByEmail = async (email) => {
    const { rows } = await pool.query(`SELECT * FROM users WHERE user_mail = $1`, [email])
    return rows[0]
}

const addUserInDb = async (fullname, email, password) => {
    await pool.query(`INSERT INTO users(user_name,user_mail,user_password) VALUES($1,$2,$3)`, [fullname, email, password])
}

module.exports = { findUserByEmail, addUserInDb }