const usersModel = require('../models/usersModel')
const bcrypt = require('bcrypt')
const fs = require('fs')
const {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  endOfYear,
  startOfYear,
} = require('date-fns')
const { createLog } = require('../models/auditLogsModel')
const { getCurrentFormat } = require('../utils/getCurrentTime')
const generatePassword = require('../utils/passwordGenerator')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: 'dgf4rk3en',
  api_key: '184696318166934',
  api_secret: 'UhXiDPl058kvgZy7K-_dGaB4AQ8',
})

async function createUser(req, res) {
  try {
    const file = req.file
    const jsonData = JSON.parse(req.body.json)
    const {
      role,
      username,
      password,
      department,
      scheduletype,
      rateperhour,
      status,
      active,
      fullname,
      birthdate,
      address,
      email,
      contact,
      rfid,
      schedule,
    } = jsonData
    const checkduplicate = await usersModel.findUser({ username: username })
    const checkRFID = await usersModel.findUser({ rfid: rfid })
    if (
      !role ||
      !username ||
      !password ||
      !department ||
      !scheduletype ||
      !rateperhour ||
      !status ||
      !active ||
      !fullname ||
      !birthdate ||
      !address ||
      !email ||
      !contact ||
      !rfid
    ) {
      res.status(400).json({ error: true, message: 'All fields are required' })
    } else if (checkduplicate.length) {
      res.status(409).json({ error: true, message: 'Username already exists' })
    } else if (checkRFID.length) {
      res.status(409).json({ error: true, message: 'RFID already exists' })
    } else {
      if (file) {
        const upload = await cloudinary.uploader.upload(file.path, {
          public_id: rfid,
        })
        //delete temporary files

        const hashedPwd = await bcrypt.hash(password, 10)
        const userObject = {
          ...jsonData,
          password: hashedPwd,
          imgurl: upload.url,
        }

        const insert = await usersModel.create(userObject)

        await createLog({
          employeeid: req.session.user[0].id ? req.session.user[0].id : 0,
          activity: `created an employee ${fullname}`,
          created_at: getCurrentFormat(),
        })

        res.status(201).json({
          message: 'Employee was created',
          user: insert,
        })
      } else {
        res.status(400).json({ message: 'Image is required' })
      }
      fs.unlink(file.path, (err) => {
        if (err) console.log(err)
        console.log('Tenmpfile deleted successfully!')
      })
    }
  } catch (error) {
    res
      .status(400 || error.httpCode)
      .json({ error: true, message: error.message })
  }
}

async function updateSchedule(req, res) {
  const id = req.params.id
  try {
    const jsonData = JSON.parse(req.body.json)
    const update = await usersModel.update(id, jsonData)
    res.status(201).json({
      message: 'Schedule has been updated',
      user: update,
    })
  } catch (error) {
    res
      .status(error.httpCode || 500)
      .json({ error: true, message: error.message })
  }
}

async function updateUser(req, res) {
  const id = req.params.id
  try {
    const file = req.file
    const jsonData = JSON.parse(req.body.json)
    const {
      role,
      username,
      department,
      rateperhour,
      password,
      newpassword,
      status,
      active,
      fullname,
      birthdate,
      address,
      email,
      contact,
      rfid,
      imgurl,
      schedule,
    } = jsonData

    if (
      !username ||
      !department ||
      !rateperhour ||
      !status ||
      !active ||
      !fullname ||
      !birthdate ||
      !address ||
      !email ||
      !contact ||
      !rfid
    ) {
      res.status(400).json({ error: true, message: 'All fields are required' })
    } else {
      let url
      if (file) {
        const upload = await cloudinary.uploader.upload(file.path, {
          public_id: rfid,
        })
        url = upload.url
      }

      let hashedPwd

      if (newpassword) {
        hashedPwd = await bcrypt.hash(newpassword, 10)
      }

      const userObject = {
        ...jsonData,
        imgurl: url ? url : imgurl,
        password: newpassword ? hashedPwd : password,
      }

      if (!password) delete userObject.password

      delete userObject.newpassword

      const update = await usersModel.update(id, userObject)

      if (update) {
        await createLog({
          employeeid: req.session.user[0].id ? req.session.user[0].id : 0,
          activity: `updated employee ${fullname}`,
          created_at: getCurrentFormat(),
        })
      }

      res.status(201).json({
        message: 'Employee has been updated',
        user: update,
      })

      if (file) {
        fs.unlink(file.path, (err) => {
          if (err) console.log(err)
          console.log('Tenmpfile deleted successfully!')
        })
      }
    }
  } catch (error) {
    res
      .status(error.httpCode || 500)
      .json({ error: true, message: error.message })
  }
}

async function fetchUsers(req, res) {
  try {
    const users = await usersModel.findUser({ active: 1 }, true)
    res.status(200).json(users)
  } catch (error) {
    res.status(error.httpCode).json({ error: true, message: error.message })
  }
}

async function fetchArchiveEmployees(req, res) {
  try {
    const users = await usersModel.findUser({ active: 0 })
    res.status(200).json(users)
  } catch (error) {
    res.status(error.httpCode).json({ error: true, message: error.message })
  }
}

async function archiveEmployee(req, res) {
  const id = req.params.id
  try {
    const archivedUser = await usersModel.archive(id)
    await createLog({
      employeeid: req.session.user[0].id ? req.session.user[0].id : 0,
      activity: `archived employee ${archivedUser[0].fullname}`,
      created_at: getCurrentFormat(),
    })
    res.status(201).json({
      message: `Employee ${archivedUser[0].fullname} has been archived`,
    })
  } catch (error) {
    res
      .status(error.httpCode || 500)
      .json({ error: true, message: error.message })
  }
}

async function unarchiveEmployee(req, res) {
  const id = req.params.id
  try {
    const unarchiveUser = await usersModel.unarchive(id)
    await createLog({
      employeeid: req.session.user[0].id ? req.session.user[0].id : 0,
      activity: `unarchived employee ${unarchiveUser[0].fullname}`,
      created_at: getCurrentFormat(),
    })
    res.status(200).json({
      message: `Successfully unarchived ${unarchiveUser[0].fullname}.`,
    })
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

async function fetchOneUser(req, res) {
  try {
    const id = req.params.id
    const queryObject = {
      query: {
        field: 'id',
        operator: '=',
        value: id,
      },
    }
    const user = await usersModel.findUser(queryObject)
    res.status(200).json(user)
  } catch (error) {
    res.status(error.httpCode).json({ error: true, message: error.message })
  }
}

async function fetchUserLogs(req, res) {
  try {
    const startWeek = startOfWeek(new Date())
    const endWeek = endOfWeek(new Date())
    const startMonth = startOfMonth(new Date())
    const endMonth = endOfMonth(new Date())
    const startYear = startOfYear(new Date())
    const endYear = endOfYear(new Date())

    function determineStartDate(range = '') {
      if (range === 'week') return startWeek
      if (range === 'month') return startMonth
      if (range === 'year') return startYear
    }

    function determineEndDate(range = '') {
      if (range === 'week') return endWeek
      if (range === 'month') return endMonth
      if (range === 'year') return endYear
    }

    const { range, id } = req.query
    const users = await usersModel.findLogs(
      id,
      determineStartDate(range),
      determineEndDate(range)
    )
    res.status(200).json(users)
  } catch (error) {
    res.status(error.httpCode).json({ error: true, message: error.message })
  }
}

async function fetchSingleLog(req, res) {
  const id = req.params.id
  const startdate = req.query.startdate || ''
  const enddate = req.query.enddate || ''

  try {
    const users = await usersModel.findLogs(id, startdate, enddate)
    res.status(200).json(users)
  } catch (error) {
    res.status(error.httpCode).json({ error: true, message: error.message })
  }
}

async function uploadImage(req, res) {
  try {
    const file = req.file
    const upload = await cloudinary.uploader.upload(file.path)

    //delete temporary files
    fs.unlink(file.path, (err) => {
      if (err) console.log(err)
      console.log('Temp file deleted successfully!')
    })

    res.json({ url: upload.url })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: true, message: error.message })
  }
}

async function fetchUnpaidUsers(req, res) {
  try {
    const employees = await usersModel.getEmployeeList()
    res.json(employees)
  } catch (error) {
    res.status(400).json({ error: true, message: error.message })
  }
}

async function suspendEmployee(req, res) {
  try {
    const { id } = req.params
    const { validuntil, message } = req.body
    console.log(validuntil)
    const data = await usersModel.suspend(id, validuntil, message)
    res.status(200).json({ message: 'Successfully suspended', data })
  } catch (error) {
    res.status(400).json({ error: true, message: error.message })
  }
}

async function resetPassword(req, res) {
  try {
    const { id } = req.params
    const randomPassword = generatePassword()
    const hashedPwd = await bcrypt.hash(randomPassword, 10)

    const reset = await usersModel.reset(id, hashedPwd)

    await createLog({
      employeeid: req.session.user[0].id ? req.session.user[0].id : 0,
      activity: `reset the password for employee ${reset[0].fullname}`,
      created_at: getCurrentFormat(),
    })

    res.status(200).json({
      password: randomPassword,
      data: reset,
    })
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

async function fetchLeaveList(req, res) {
  try {
    const data = await usersModel.getLeaveList()
    res.status(200).json(data)
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

module.exports = {
  createUser,
  updateUser,
  updateSchedule,
  fetchUnpaidUsers,
  fetchUsers,
  fetchOneUser,
  fetchUserLogs,
  fetchLeaveList,
  fetchSingleLog,
  uploadImage,
  fetchArchiveEmployees,
  unarchiveEmployee,
  archiveEmployee,
  suspendEmployee,
  resetPassword,
}
