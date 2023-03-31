const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const multer = require('multer')
const logger = require('../middleware/logger')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})
const upload = multer({ storage: storage })

router.post('/create', upload.single('file'), usersController.createUser)
router.post('/image', upload.single('file'), usersController.uploadImage)
router.get('/get', usersController.fetchUsers)
router.get('/get-employees', usersController.fetchUnpaidUsers)
router.put('/update/:id', upload.single('file'), usersController.updateUser)
router.get('/archive', usersController.fetchArchiveEmployees)
router.put('/archive/:id', usersController.archiveEmployee)
router.put('/unarchive/:id', usersController.unarchiveEmployee)
router.get('/get/:id', usersController.fetchOneUser)
router.get('/logs', usersController.fetchUserLogs)
router.get('/logs/:id', usersController.fetchSingleLog)

module.exports = router
