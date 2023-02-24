require('dotenv').config()
const express = require('express')
const app = express()
const PORT = 3500
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const corsOptions = require('./config/corsOptions')
const { requireSession } = require('./middleware/requireAuth')

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))
app.use(cookieParser())

app.use(
  session({
    key: 'userId',
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
)

// app.use("/users", requireSession, require("./routes/usersRoutes"));
app.use('/users', require('./routes/usersRoutes'))
app.use('/auth', require('./routes/authRoutes'))

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
