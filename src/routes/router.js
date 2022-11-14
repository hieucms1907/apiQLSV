const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const studentController = require('../controllers/student.controller');



router.post('/Authentication/Login', userController.auth)

router.get('/Authentication/CheckToken', authController.checkToken)

//Student
router.get('/Student/getLists', studentController.getAll)

module.exports = router