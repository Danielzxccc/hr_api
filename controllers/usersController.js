const usersModel = require('../models/usersModel')
const bcrypt = require('bcrypt')
const fs = require('fs')
const { error } = require('console')
const client = require('../config/dbConfig')
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
      shift_timein,
      shift_timeout,
      dayoff,
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
          dayoff,
        }

        const insert = await usersModel.create(userObject)

        const scheduleObject = {
          employeeid: insert[0].id,
          shift_timein,
          shift_timeout,
        }

        const schedule = await usersModel.createSchedule(scheduleObject)

        res.status(201).json({
          message: 'Employee was created',
          user: insert,
          schedule,
        })
      } else {
        res.status(400).json({ message: 'Image is required' })
      }
    }
    //delete temporary files
    fs.unlink(file.path, (err) => {
      if (err) console.log(err)
      console.log('Tenmpfile deleted successfully!')
    })
  } catch (error) {
    res
      .status(400 || error.httpCode)
      .json({ error: true, message: error.message })
  }
}

async function updateUser(req, res) {
  const id = req.params.id
  try {
    const update = await usersModel.update(id, req.body)
    res.status(200).json({ message: 'Updated Successfully' })
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

async function fetchUsers(req, res) {
  try {
    const users = await usersModel.findUser(req.body)
    res.status(200).json(users)
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

module.exports = {
  createUser,
  fetchUsers,
  fetchOneUser,
  fetchUserLogs,
  uploadImage,
}
