const express = require('express');

const studentController = require('../controllers/student');
const isAuth = require('../middleware/students-is-auth');

const router = express.Router();

// GET /feed/posts
router.post('/login',studentController.login);
router.get('/show-public-note',studentController.show_public_notes);
router.get('/show-private-note',studentController.show_private_notes);

module.exports = router;