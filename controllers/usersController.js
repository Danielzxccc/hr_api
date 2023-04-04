const usersModel = require('../models/usersModel')
const bcrypt = require('bcrypt')
const fs = require('fs')
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
          role,
          username,
          password: hashedPwd,
          department,
          scheduletype,
          rateperhour,
          status,
          fullname,
          birthdate,
          address,
          email,
          contact,
          imgurl: upload.url,
          rfid,
          schedule,
        }

        const insert = await usersModel.create(userObject)

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

      const userObject = {
        role,
        username,
        department,
        rateperhour,
        status,
        fullname,
        birthdate,
        address,
        email,
        contact,
        imgurl: url ? url : imgurl,
        rfid,
        schedule,
      }

      const update = await usersModel.update(id, userObject)

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
      .json({ error: true, message: 'Username or RFID already exists.' })
  }
}

async function fetchUsers(req, res) {
  try {
    const users = await usersModel.findUser({ active: 1 })
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
    res.status(201).json({
      message: `Employee ${archivedUser[0].fullname} has been archived`,
    })
  } catch (error) {
    res.status(error.httpCode).json({ error: true, message: error.message })
  }
}

async function unarchiveEmployee(req, res) {
  const id = req.params.id
  try {
    const unarchiveUser = await usersModel.unarchive(id)
    res.status(200).json({
      message: `Successfully unarchived ${unarchiveUser[0].fullname}.`,
    })
  } catch (error) {
    res.status(error.httpCode).json({ error: true, message: error.message })
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
    const users = await usersModel.findLogs()
    res.status(200).json(users)
  } catch (error) {
    res.status(error.httpCode).json({ error: true, message: error.message })
  }
}

async function fetchSingleLog(req, res) {
  const id = req.params.id
  try {
    const users = await usersModel.findLogs(id)
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

module.exports = {
  createUser,
  updateUser,
  updateSchedule,
  fetchUnpaidUsers,
  fetchUsers,
  fetchOneUser,
  fetchUserLogs,
  fetchSingleLog,
  uploadImage,
  fetchArchiveEmployees,
  unarchiveEmployee,
  archiveEmployee,
}
