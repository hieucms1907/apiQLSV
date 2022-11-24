const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const studentController = require('../controllers/student.controller');
const departmentController = require('../controllers/department.controller');
const classroomController = require('../controllers/classroom.controller');

router.post('/Authentication/Login', userController.auth)
router.get('/Authentication/CheckToken', authController.checkToken)

//Student
router.get('/Student/getLists', studentController.getAll)
router.post('/Student/create', studentController.createStudent)
router.put('/Student/update/:id', studentController.updateStudent)
router.delete('/Student/delete', studentController.deleteStudent)

//Department
router.get('/Department/getLists', departmentController.getAll)
router.get('/Department/getDetailDepartment/:id', departmentController.getDepartmentById)
router.post('/Department/create', departmentController.createDeparment)
router.put('/Department/update/:id', departmentController.updateDeparment)
router.delete('/Department/delete', departmentController.deleteDeparment)

//Classroom
router.get('/Classroom/getLists', classroomController.getAll)
router.get('/Classroom/getByDepartment/:id', classroomController.getClassroomByDepartment)
router.post('/Classroom/create', classroomController.createClassroom)
router.put('/Classroom/update/:id', classroomController.updateClassroom)

module.exports = router