const express = require('express');

const instructorController = require('../controllers/instructor');
const isAuth = require('../middleware/instructor-is-auth');
var uuid = require('uuid');
const path = require('path');

const multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let path;
        path = './public/limpidityie';
        callBack(null, path)     //  directory name where save the file
          
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + uuid.v1() + path.extname(file.originalname))
    }
  });
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  var upload = multer({
    storage: storage,
    fileFilter: fileFilter
  }); 







const router = express.Router();

// GET /feed/posts
router.post('/login',instructorController.login);
//router.get('/add-marks-class',isAuth,instructorController.addmark_see_class);
router.get('/see_sections',isAuth,instructorController.see_sections);
//router.get('/add-marks-students/:sectionID',isAuth,instructorController.addmark_see_students);

router.get('/see_students/:sectionID',instructorController.see_students);
router.get('/getStudent/:studentID',instructorController.getStudent);


router.post('/add_class_note',instructorController.add_class_note);
router.post('/add_section_note/:sectionID',instructorController.add_section_note);

router.post('/add_week_program/:sectionID',instructorController.add_week_program);

router.post('/add_limpidityie/:studentID',upload.single('limpidityie'),instructorController.add_limpidityie)
router.get('/see_limpidityie/:studentID',instructorController.see_limpidityie)


router.post('/add-marks',instructorController.add_marks);
router.post('/add-note/:studentID',instructorController.add_note);
router.post('/check_attendance',instructorController.check_attendance);

module.exports = router;