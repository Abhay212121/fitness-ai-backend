const { body, validationResult } = require('express-validator')
const db = require('../db/queries')
const bcrypt = require('bcrypt')

const textRegex = /^[A-Za-z ]+$/;
const passRegex = /^[A-Za-z\d@$!%*#?&^_-]{6,32}$/;


const validateUserSignupData = [
    body('fullName').trim().notEmpty().withMessage('Fullname required!').matches(textRegex).withMessage('special symbols not allowed!'),
    body('email').isEmail().withMessage('Enter a valid email!').notEmpty().withMessage('email is required!'),
    body('password').trim().isLength({ min: 6 }).withMessage('please use a strong password!').matches(passRegex).withMessage('Special symbols not allowed!')
]

const validateUserLoginData = [
    body('email').isEmail().withMessage('Enter a valid email!').notEmpty().withMessage('email is required!'),
    body('password').trim().isLength({ min: 6 }).withMessage('please use a strong password!').matches(passRegex).withMessage('Special symbols not allowed!')
]

const registerUser = [validateUserSignupData,
    async (req, res) => {

        //check for validation arrays.
        const errors = validationResult(req).array({ onlyFirstError: true })

        const { fullName, email, password } = req.body
        //check if user already exists in db if yes then do nothing.
        const user = await db.findUserByEmail(email)
        if (user) {
            errors.push({ path: 'email', msg: 'email already exists!' })
        }

        if (errors.length > 0) {
            return res.json({ status: 400, errors: errors })
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
    }]

const userLogin = [validateUserLoginData, async (req, res) => {
    const { email, password } = req.body

    const errors = validationResult(req).array({ onlyFirstError: true })
    try {
        //check if email exists 
        const user = await db.findUserByEmail(email)
        if (user) {
            //user email found now let's check if password matches.
            const isMatch = await bcrypt.compare(password, user.user_password)

            //there is match
            if (isMatch) {
                return res.json({ status: 200, msg: `welcome ${user.user_name}` })
            }
            errors.push({ path: 'password', msg: 'wrong password' })
            return res.json({ status: 401, errors: errors })
        } else {
            errors.push({ path: 'email', msg: 'user not found' })
            return res.json({ status: 404, errors: errors })
        }

    } catch (error) {

    }


    // console.log(email, password)
}]

module.exports = { registerUser, userLogin }