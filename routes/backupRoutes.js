const express = require('express')
const router = express.Router()
const backupController = require('../controllers/backupController')

router.get('/users', backupController.getUsersRecords)
router.get('/list', backupController.listFiles)
router.post('/export', backupController.exportDateFromTable)
router.get('/logs', backupController.getUserLogsRecords)
router.get('/payroll', backupController.getUserPayrolls)
router.post('/confirm', backupController.confirmPassword)

module.exports = router
