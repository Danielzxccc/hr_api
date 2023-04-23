const express = require('express')
const router = express.Router()
const auditLogsController = require('../controllers/auditLogsController')

router.get('/get', auditLogsController.findAll)

module.exports = router
