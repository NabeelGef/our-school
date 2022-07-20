const express = require('express');

const studentController = require('../controllers/student');
const isAuth = require('../middleware/students-is-auth');

const router = express.Router();

// GET /feed/posts
router.post('/login',studentController.login);
router.get('/show-public-note',isAuth,studentController.show_public_notes);
router.get('/show-private-note',isAuth,studentController.show_private_notes);
router.get('/show_marks',isAuth,studentController.show_marks);
router.post('/send_complaint',isAuth,studentController.send_Complaint);
router.get('/show_week_program/:section',studentController.show_week_program);
//router.get('/show_section_note',isAuth,studentController.show_sections_notes);

module.exports = router;