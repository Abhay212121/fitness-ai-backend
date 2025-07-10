const db = require('../db/queries')
const bcrypt = require('bcrypt')

const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body.data

    //check if user already exists in db if yes then do nothing.
    const user = await db.findUserByEmail(email)
    if (user) {
        return res.json({ status: 409, msg: 'User already exists!' })
    }

    //user doesn't exsist in db.
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 8)

    try {
        //add the user in db.
        await db.addUserInDb(fullName, email, hashedPassword)
        return res.json({ status: 201, msg: 'User Registered!' })
    } catch (error) {
        console.log("Err:", error)
        return res.json({ status: 500, msg: 'Internal Server error!' })
    }
}

const userLogin = (req, res) => {
    res.json({ status: 200, message: 'Looged in!' })
}

module.exports = { registerUser, userLogin }