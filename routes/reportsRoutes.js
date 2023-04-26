const express = require('express')
const router = express.Router()
const reportsController = require('../controllers/reportsController')

router.get('/barchart', reportsController.getBarChartData)
router.get('/piechart', reportsController.getPieChartData)
router.get('/linechart', reportsController.getLineChartData)
router.get('/summary', reportsController.getSummaryData)

module.exports = router
