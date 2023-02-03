require('dotenv').config()
const express = require('express')
const app = express()
const PORT = 3500

app.use(express.json())
app.use('/users', require('./routes/usersRoutes'))

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
