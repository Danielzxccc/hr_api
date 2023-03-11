const { findUser } = require('../models/usersModel')
const {
  createLog,
  checkDay,
  findTimeIn,
  addTimeOut,
} = require('../models/authModel')
const {
  getTime,
  createDateObject,
  getCurrentDay,
} = require('../utils/getCurrentTime')
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
      active: 1,
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

        const currentDay = getCurrentDay()

        let shift_timein
        let shift_timeout

        function getCurrentSchedule() {
          const schedule = results[0].schedule.filter(
            (item) => item.day === currentDay
          )
          shift_timein = schedule.shift_timein
          shift_timeout = schedule.shift_timeout
        }

        getCurrentSchedule()

        if (!checkLogs.length) {
          if (results[0].schedule?.some((item) => item.day === currentDay)) {
            const generateLog = await createLog(results[0].id)
            res.status(201).json({
              message: `Successfully timed in as ${results[0].fullname}.`,
              data: generateLog[0],
            })
          } else if (
            createDateObject(shift_timein) <= createDateObject(getTime()) &&
            createDateObject(shift_timeout) >= createDateObject(getTime())
          ) {
            res
              .status(400)
              .json({ error: true, message: 'You are not on your shift.' })
          } else {
            res
              .status(400)
              .json({ error: true, message: 'You are on day off.' })
          }
        } else {
          res.status(400).json({
            error: true,
            message: 'Employee already logged in',
          })
        }
      }
    }
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

async function timeout(req, res) {
  const { rfid, isConfirmed } = req.body
  try {
    const results = await findUser({ rfid: rfid, active: 1 })

    const currentDay = getCurrentDay()
    let shift_timein
    let shift_timeout

    function getCurrentSchedule() {
      const schedule = results[0].schedule.filter(
        (item) => item.day === currentDay
      )
      shift_timein = schedule.shift_timein
      shift_timeout = schedule.shift_timeout
    }

    getCurrentSchedule()

    if (!results.length) {
      res.status(400).json({ error: true, message: 'Unauthorized' })
    } else {
      const timeIn = await findTimeIn(results[0].id)
      if (!timeIn.length) {
        res
          .status(400)
          .json({ error: true, message: 'You are not logged in yet' })
      } else {
        const currentTime = createDateObject(getTime())
        const shiftOut = createDateObject(shift_timeout)
        if (timeIn[0].time_out !== null) {
          res
            .status(401)
            .json({ error: true, message: 'You Already Logged Out' })
        } else if (shiftOut <= currentTime) {
          await addTimeOut(results[0].id)
          res.status(200).json({ message: 'Successfully Logged Out' })
        } else {
          if (isConfirmed) {
            await addTimeOut(results[0].id)
            res.status(200).json({ message: 'Successfully Logged Out' })
          } else {
            res
              .status(403)
              .json({ error: true, message: 'You are too early to log out' })
          }
        }
      }
    }
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
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

module.exports = { authLogin, refreshToken, logout, authLoginViaCard, timeout }
