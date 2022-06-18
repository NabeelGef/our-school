const express = require('express');
const { body } = require('express-validator/check');


const adminController = require('../controllers/admin');
const isAuth = require('../middleware/admin-is-auth');

const router = express.Router();


router.post(
  '/add-instructor',
[
  body('first_name')
    .trim()
    .isLength({ min: 3 }),
  body('last_name')
    .trim()
    .isLength({ min: 3 }),
    body('username')
    .trim()
    .isLength({ min: 3 }),
    body('password')
    .isLength({ min: 5 }),
],adminController.getAddInstructor);


router.get('/instructors',adminController.ShowInstructors);

router.put(
  '/instructor/:instructorID',
[
  body('first_name')
    .trim()
    .isLength({ min: 3 }),
  body('last_name')
    .trim()
    .isLength({ min: 3 }),
    body('username')
    .trim()
    .isLength({ min: 3 }),
    body('password')
    .isLength({ min: 5 }),
],adminController.updateInstructor);

router.delete('/instructor/:InstructorID',adminController.deleteInstructor);

// router.get('/instructor/:InstructorID',adminController.getInstructor);

//----------------------------------------------------------------------


router.post('/add-student',
[
  body('first_name')
    .trim()
    .isLength({ min: 3 }),
  body('last_name')
    .trim()
    .isLength({ min: 3 }),
    body('father_name')
    .trim()
    .isLength({ min: 3 }),
],adminController.getAddStudent);



router.get('/show-all-students',adminController.ShowStudents);

router.put('/student/:studentID',
[
  body('first_name')
    .trim()
    .isLength({ min: 3 }),
  body('last_name')
    .trim()
    .isLength({ min: 3 }),
    body('father_name')
    .trim()
    .isLength({ min: 3 }),
    body('password')
    .isLength({ min: 5 }),
],adminController.updateStudent);

router.delete('/student/:StudentID',adminController.deleteStudent);

// router.get('/student/:StudentID',adminController.getStudent);

//----------------------------------------------------------------------
router.post('/add-announcement',adminController.addAnnouncement);

router.get('/show-all-announcement',adminController.ShowAnnouncements);

router.put('/announcement/:AnnouncementID',adminController.updateAnnouncement)

router.delete('/announcement/:AnnouncementID',adminController.deleteAnnouncement);

// router.get('/announcement/:AnnouncementID',adminController.getAnnouncement);


module.exports = router;