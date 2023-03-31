const express = require('express')
const router = express.Router()
const backupController = require('../controllers/backupController')

router.get('/users', backupController.getUsersRecords)
router.get('/logs', backupController.getUserLogsRecords)
router.get('/payroll', backupController.getUserPayrolls)

module.exports = router
