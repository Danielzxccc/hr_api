const { findUser } = require('../models/usersModel')
const {
  createLog,
  checkDay,
  findTimeIn,
  addTimeOut,
  checkAttendance,
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

    const checklogs = await checkAttendance(results[0].id)

    if (!checklogs.length)
      return res.status(400).json({
        error: true,
        message:
          'Warning: It seems that you did not time in before logging in.',
      })

    if (checklogs[0].time_out)
      return res
        .status(400)
        .json({ error: true, message: 'You already timed out' })

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

async function authAdminCard(req, res) {
  const { rfid } = req.body
  try {
    const results = await findUser({
      rfid: rfid,
      department: 'hr',
      active: 1,
    })

    const checklogs = await checkAttendance(results[0].id)

    if (!checklogs.length) {
      return res.status(400).json({
        error: true,
        message:
          'Warning: It seems that you did not time in before logging in.',
      })
    }

    if (checklogs[0].time_out)
      return res
        .status(400)
        .json({ error: true, message: 'You already timed out' })

    if (!results.length) {
      res.status(400).json({
        message: 'Unauthorized',
      })
    } else {
      req.session.user = results
      res.status(200).json({
        message: 'Success',
        user: req.session.user,
      })
    }
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

// tap card controller
async function authLoginViaCard(req, res) {
  const { rfid, isConfirmed } = req.body
  try {
    // check user credentials
    const results = await findUser({
      rfid: rfid,
      active: 1,
    })

    //throw error if credentials are invalid
    if (!results.length) {
      return res.status(400).json({
        message: 'Unauthorized',
      })
    }

    //throw error if user doesnt have schedule
    if (!results[0].schedule)
      return res.status(400).json({
        error: true,
        message: 'You dont have a schedule',
      })

    //check logs and get current day date
    const checkLogs = await checkDay(results[0].id)
    const currentDay = getCurrentDay()

    //get shift hours of the user using the credentials that are sent in request body
    function getCurrentSchedule() {
      const schedule = results[0]?.schedule.filter(
        (item) => item.day === currentDay
      )
      return schedule.length
        ? [schedule[0].shift_timein, schedule[0].shift_timeout]
        : ['00:00', '00:00']
    }

    const shift_timein = getCurrentSchedule()[0]
    const shift_timeout = getCurrentSchedule()[1]

    if (!checkLogs.length) {
      if (
        createDateObject(getTime()) <= createDateObject(shift_timein) ||
        createDateObject(getTime()) >= createDateObject(shift_timeout)
      ) {
        return res
          .status(400)
          .json({ error: true, message: 'You are not on your shift.' })
      }

      if (results[0].schedule.some((item) => item.day === currentDay)) {
        const generateLog = await createLog(results[0].id)
        return res.status(201).json({
          message: `Successfully timed in as ${results[0].fullname}.`,
          data: generateLog[0],
        })
      } else {
        res.status(400).json({ error: true, message: 'You are on day off.' })
      }

      // if (
      //   createDateObject(shift_timeout) <= createDateObject(getTime()) &&
      //   createDateObject(shift_timein) >= createDateObject(getTime())
      // ) {
      //   return res
      //     .status(400)
      //     .json({ error: true, message: 'You are not on your shift.' })
      // }
    } else {
      const timeIn = await findTimeIn(results[0].id)
      const currentTime = createDateObject(getTime())
      const shiftOut = createDateObject(getCurrentSchedule()[1])

      // check if user is already logged out
      if (timeIn[0].time_out !== null) {
        return res
          .status(401)
          .json({ error: true, message: 'You Already Logged Out' })
      }

      // add overtime functions here soon

      const checkOvertime =
        (createDateObject(getTime()) - createDateObject(shift_timeout)) /
        3600000
      console.log(checkOvertime)
      // if user shift time out is greater than or equal to current time send 200 http status
      if (shiftOut <= currentTime) {
        if (checkOvertime > 0) {
          await addTimeOut(results[0].id, checkOvertime)
        } else {
          await addTimeOut(results[0].id)
        }
        return res.status(200).json({ message: 'Successfully Logged Out' })
      }

      // for confirmation of logout
      if (isConfirmed) {
        console.log(checkOvertime)
        if (checkOvertime > 0) {
          await addTimeOut(results[0].id, checkOvertime)
        } else {
          await addTimeOut(results[0].id)
        }
        return res.status(200).json({ message: 'Successfully Logged Out' })
      }

      // send a 403 status if the user is going to be under time
      res
        .status(403)
        .json({ error: true, message: 'You are too early to log out' })
    }
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.stack })
  }
}

// this controller will be removed in the future
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

module.exports = {
  authLogin,
  authAdminCard,
  refreshToken,
  logout,
  authLoginViaCard,
  timeout,
}
