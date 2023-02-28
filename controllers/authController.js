const { findUser, findEmployee } = require('../models/usersModel')
const { createLog, checkDay } = require('../models/authModel')
const bcrypt = require('bcrypt')

async function authLogin(req, res) {
  const loginDetails = req.body
  try {
    const results = await findUser({
      username: loginDetails.username,
      department: 'hr',
    })
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

async function authLoginViaCard(req, res) {
  const { rfid } = req.body
  try {
    const results = await findUser({
      rfid: rfid,
    })
    if (!results.length) {
      res.status(400).json({
        message: 'Unauthorized',
      })
    } else {
      if (results[0].department === 'hr') {
        req.session.user = results
        res.status(200).json({
          message: 'Success',
          user: req.session.user,
        })
      } else {
        const checkLogs = await checkDay(results[0].id)
        if (!checkLogs.length) {
          const generateLog = await createLog(results[0].id)
          res.status(201).json({
            message: `Successfully timed in as ${results[0].fullname}`,
            data: generateLog[0],
          })
        } else {
          res.status(400).json({
            error: true,
            message: 'Employee already logged in',
          })
        }
      }
    }
    // if (!results.length) {
    //   res.status(400).json({
    //     message: 'Unauthorized',
    //   })
    //   // const resultsEmployee = await findEmployee(rfid)
    //   // if (!resultsEmployee.length) {
    //   //   res.status(400).json({ error: true, message: 'Unauthorized' })
    //   // } else {
    // const checkLogs = await checkDay(results[0].id)
    // if (!checkLogs.length) {
    //   const generateLog = await createLog(results[0].id)
    //   res.status(201).json({
    //     message: `Successfully timed in as ${results[0].fullname}`,
    //     data: generateLog[0],
    //   })
    // } else {
    //   res.status(400).json({
    //     error: true,
    //     message: 'Employee already logged in',
    //   })
    // }
    //   // }
    // } else {
    // req.session.user = results
    // res.status(200).json({
    //   message: 'Success',
    //   user: req.session.user,
    //   })
    // }
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message + ' test' })
  }
}

async function timeIn(req, res) {
  try {
    const rfid = req.body.rfid
    console.log(rfid)
    const results = await findEmployee(rfid)

    if (!results.length) {
      res.status(400).json({
        message: 'Unauthorized',
      })
    } else {
      const checkLogs = await checkDay(results[0].id)

      if (!checkLogs.length) {
        const generateLog = await createLog(results[0].id)
        res.status(201).json({ message: 'Success', data: generateLog[0] })
      } else {
        res.status(400).json({
          error: true,
          message: `Successfully timed in as ${results[0].fullname}`,
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

module.exports = { authLogin, refreshToken, logout, authLoginViaCard, timeIn }
