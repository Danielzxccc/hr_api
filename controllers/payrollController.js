const payrollModel = require('../models/payrollModel')

async function createPayroll(req, res) {
  try {
    const insertPayroll = await payrollModel.create(req.body)
    res
      .status(201)
      .json({ message: 'Created Successfully', data: insertPayroll })
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

async function getAllPayroll(req, res) {
  try {
    const query = await payrollModel.findAll()
    res.status(200).json(query)
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

async function getOnePayroll(req, res) {
  try {
    const id = req.params.id
    const query = await payrollModel.findOne(id)
    res.status(200).json(query)
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

module.exports = { createPayroll, getAllPayroll, getOnePayroll }
