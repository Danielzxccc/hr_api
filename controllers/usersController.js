const usersModel = require('../models/usersModel')
const bcrypt = require('bcrypt')

async function createUser(req, res) {
  try {
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
    } = req.body

    const checkduplicate = await usersModel.findOne('username', username)
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
      !contact
    ) {
      res.status(400).json({ error: true, message: 'All fields are required' })
    } else if (checkduplicate.length) {
      res.status(409).json({ error: true, message: 'Username already exists' })
    } else {
      const hashedPwd = await bcrypt.hash(password, 10)
      const userObject = {
        role: role,
        username: username,
        password: hashedPwd,
        department: department,
        scheduletype: scheduletype,
        rateperhour: rateperhour,
        status: status,
        fullname: fullname,
        birthdate: birthdate,
        address: address,
        email: email,
        contact: contact,
      }

      const insert = await usersModel.create(userObject)
      res.status(201).json({
        message: 'Employee was created',
        user: insert,
      })
    }
  } catch (error) {
    res.status(error.httpCode).json({ error: true, message: error.message })
  }
}

async function fetchUsers(req, res) {
  try {
    const users = await usersModel.findAll()
    res.status(200).json(users)
  } catch (error) {
    res.status(error.httpCode).json({ error: true, message: error.message })
  }
}

async function fetchOneUser(req, res) {
  try {
    const id = req.params.id
    const user = await usersModel.findOne('id', id)
    res.status(200).json(user)
  } catch (error) {
    res.status(error.httpCode).json({ error: true, message: error.message })
  }
}

module.exports = { createUser, fetchUsers, fetchOneUser }
