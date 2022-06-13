const express = require('express');

const instructorController = require('../controllers/instructor');
const isAuth = require('../middleware/instructor-is-auth');

const router = express.Router();

// GET /feed/posts
router.post('/login',instructorController.login);
router.get('/add-marks-class',isAuth,instructorController.addmark_see_class);
router.get('/see_sections',instructorController.see_sections);
//router.get('/add-marks-students/:sectionID',isAuth,instructorController.addmark_see_students);

router.get('/see_students/:sectionID',instructorController.see_students);
router.get('/getStudent/:studentID',instructorController.getStudent);

router.post('/add-marks',instructorController.add_marks);
router.post('/add-note/:studentID',instructorController.add_note);
router.post('/chech_attendance',instructorController.check_attendance);

router.post('/add-marks-students');
router.post('/add-note/:studentID',instructorController.add_note);
module.exports = router;