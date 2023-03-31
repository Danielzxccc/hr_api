const express = require('express')
const router = express.Router()
const payrollController = require('../controllers/payrollController')

router.post('/create', payrollController.createPayroll)
router.get('/get', payrollController.getAllPayroll)
router.get('/get/:id', payrollController.getOnePayroll)

module.exports = router
