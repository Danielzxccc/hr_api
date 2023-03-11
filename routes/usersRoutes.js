const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/') // specify the directory where the uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // specify the naming convention for uploaded files
  },
})
const upload = multer({ storage: storage })

router.post('/create', upload.single('file'), usersController.createUser)
router.post('/image', upload.single('file'), usersController.uploadImage)
router.get('/get', usersController.fetchUsers)
router.get('/archive', usersController.fetchArchiveEmployees)
router.put('/archive/:id', usersController.archiveEmployee)
router.put('/unarchive/:id', usersController.unarchiveEmployee)
router.get('/get/:id', usersController.fetchOneUser)
router.get('/logs', usersController.fetchUserLogs)

module.exports = router
