const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

router.post('/create', usersController.createUser)
router.get('/get', usersController.fetchUsers)
router.get('/get/:id', usersController.fetchOneUser)

module.exports = router
