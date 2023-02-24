const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/login', authController.authLogin)
router.post('/card', authController.authLoginViaCard)
router.get('/refresh', authController.refreshToken)
router.delete('/logout', authController.logout)

module.exports = router
