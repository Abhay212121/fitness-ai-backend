require('dotenv').config()
const express = require('express');
const userRoute = require('./routes/userRoute');
const cors = require('cors');
const trackRoute = require('./routes/trackRoute');

const app = express();
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json({ status: 200, message: 'Server is running!' })
})

app.use('/user', userRoute)
app.use('/track', trackRoute)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started over PORT: ${PORT}`))