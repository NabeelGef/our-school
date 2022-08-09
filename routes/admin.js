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
    body('classeNameClass')
    .notEmpty()
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
    body('classeNameClass')
    .exists()
    .notEmpty()
],adminController.updateInstructor);

router.delete('/instructor/:InstructorID',adminController.deleteInstructor);

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
    body('BirthDate')
    .notEmpty(),
    body('classeNameClass')
    .notEmpty(),
    body('section')
    .notEmpty()
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
    body('BirthDate')
    .notEmpty(),
    body('classeNameClass')
    .notEmpty(),
    body('section')
],adminController.updateStudent);

router.delete('/student/:StudentID',adminController.deleteStudent);


//----------------------------------------------------------------------
router.post('/add-announcement',
[
    body('title')
    .isLength({ min: 5 })
    .notEmpty(),
    body('message')
    .isLength({ min: 10 })
    .notEmpty(),
      body('exp_date')
      .notEmpty()
],adminController.addAnnouncement);

router.get('/show-all-announcement',adminController.ShowAnnouncements);

router.put('/announcement/:AnnouncementID',
[
    body('title')
    .isLength({ min: 5 })
    .notEmpty(),
    body('message')
    .isLength({ min: 10 })
    .notEmpty(),
      body('exp_date')
      .notEmpty()
],adminController.updateAnnouncement)

router.delete('/announcement/:AnnouncementID',adminController.deleteAnnouncement);


module.exports = router;