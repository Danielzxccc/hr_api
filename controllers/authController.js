const authModel = require('../models/authModel')
const bcrypt = require('bcrypt')

async function authLogin(req, res) {
  const loginDetails = req.body
  try {
    const results = await authModel.findUsername(loginDetails.username)
    if (!results.length) {
      res.status(400).json({
        message: 'No username by that name in HR department',
      })
    } else {
      const compare = await bcrypt.compare(
        loginDetails.password,
        results[0].password
      )
      if (!compare) {
        res.status(401).json({
          error: true,
          message: 'Unauthorized Access!',
        })
      } else {
        req.session.user = results
        res.status(200).json({
          message: 'Success',
          user: req.session.user,
        })
      }
    }
  } catch (error) {
    res.status(error.httpCode).json({ error: true, message: error.message })
  }
}

function refreshToken(req, res) {
  if (req.session.user) {
    res.json({ token: true, user: req.session.user })
  } else {
    res.json({ token: false })
  }
}

function logout(req, res) {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json({ message: 'unable to logout' })
      } else {
        res.status(200).json({ message: 'logout successfully' })
      }
    })
  }
}

module.exports = { authLogin, refreshToken, logout }
