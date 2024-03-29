const express = require('express');

const instructorController = require('../controllers/instructor');
const isAuth = require('../middleware/instructor-is-auth');
const { body } = require('express-validator/check');

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


///////////////////////////////////////////////////////////////////
router.post('/login',
[
    body('username')
    .trim()
    .isLength({ min: 3 }),
    body('password')
    .trim()
    .isLength({ min: 5 }),
    body('tokenMessage')
    .notEmpty()
],instructorController.login);
///////////////////////////////////////////////////////////////////
router.get('/see_sections',isAuth,instructorController.see_sections);
router.get('/see_students/:sectionID',instructorController.see_students);

///////////////////////////////////////////////////////////////////
router.post('/add_week_program/:sectionID',
[
  body('program.*.day')
  .notEmpty(),
  body('program.*.first')
  .notEmpty(),
  body('program.*.second')
  .notEmpty(),
  body('program.*.third')
  .notEmpty(),
  body('program.*.forth')
  .notEmpty(),
  body('program.*.fifth')
  .notEmpty(),
  body('program.*.sixth')
  .notEmpty()
],instructorController.add_week_program);
router.get('/show_week_program/:sectionID',instructorController.show_week_program);
router.post('/edit_week_program/:sectionID',instructorController.update_week_program);

///////////////////////////////////////////////////////////////////
router.get('/getComplaint',isAuth,instructorController.getComplaint);

///////////////////////////////////////////////////////////////////
router.post('/add_class_note',instructorController.add_class_note);
router.post('/add_section_note/:sectionID',instructorController.add_section_note);
router.post('/add-note/:studentID',instructorController.add_note);
router.post('/add-marks',instructorController.add_marks);
router.post('/check_attendance',instructorController.check_attendance);

///////////////////////////////////////////////////////////////////
router.post('/add_limpidityie/:studentID',upload.single('limpidityie'),instructorController.add_limpidityie)

////////////////////////////////////////////////////////////////////
router.post('/addAbsenceNote/:studentID',[
  body('message')
    .trim()
    .isLength({ min: 5 }),
    
],instructorController.addAbcenseNote);




module.exports = router;