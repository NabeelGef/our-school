const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Instructor = require('../models/instructor');
const Section = require('../models/section');
const Student = require('../models/student');
const Note = require('../models/note');


exports.login = (req,res,next ) =>{
    const username = req.body.username;
    const password = req.body.password;
    let loadedUser;

    Instructor.findAll({where :{username : username}})
    .then(instructors =>{
        if(!instructors)
        {
            const error = new Error('A instructor with this username could not be found.');
            error.statusCode = 401;
            throw error;
        }
        let i =0;
        while(instructors[i])
        {
          if(instructors[i].password == password)
          {
            loadedUser = instructors[i];
            return true;
          }
          i++;
        }
        return false;

    })
    .then(isEqual =>{
        if(!isEqual)
        {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
          {
            username: loadedUser.username,
            userId: loadedUser.id
          },
          'somesupersecretsecret',
          { expiresIn: '1h' }
        );
        res.status(200).json({
           token: token,
           ins_id: loadedUser.id,
           type : loadedUser.type,
           username : loadedUser.username,
           firstName : loadedUser.first_name,
           lastName : loadedUser.last_name,
           password : loadedUser.password,
           name_class : loadedUser.classeNameClass
          });
    })
     .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addmark_see_class = (req,res,next) =>{
    id = req.userId;
    Instructor.findByPk(id)
    .then(instructor =>{
      if(!instructor)
      {
        const error = new Error('A instructor with this username could not be found.');
        error.statusCode = 401;
        throw error;
      }
        const instructor_class = instructor.classeNameClass;
        return Section.findAll({where :{classeNameClass : instructor_class}})
    })
    .then(sections =>{
        res.status(200).json({
            message: 'Fetched sections successfully.',
            sections: sections
          });
    })
    .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };


  exports.addmark_see_students = (req,res,next) =>{

      let section_id = req.params.sectionID;
      Student.findAll({where : {sectionId :section_id}})
      .then(student =>{
        res.status(200).json({
            message: 'student sections successfully.',
            student: student
          });
      })
    .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };


  exports.addmark_see_students2 =(req,res,next) =>{
    const subject = 1;
    const fullmark = 2;
  }


  exports.add_note = (req,res,next) =>{
    const student_id = req.params.studentID;
    const message = req.body.message;
    const exp_date = req.body.exp_date;
    Student.findByPk(student_id)
    .then(student =>{
      student.createNote({
        message : message,
        exp_date : exp_date
      })
    })
    .then(() =>{
      res.status(200).json({
        message : 'note has been sent'
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.getStudent = async(req,res,next) =>{
  const id = req.params.studentID;
  let student_sneding;
  const student = await Student.findByPk(id)
  const section_row =  await Section.findByPk(students[i].sectionId);
  student_sneding = {
    id : student.id,
    first_name : student.first_name,
    last_name : student.last_name,
    father_name : student.father_name,
    BirthDate : student.BirthDate,
    classeNameClass : section_row.classeNameClass,
    section :  section_row.name_sec,
    password : student.password
  }
  res.status(200).send(student_sneding);


};


  exports.logout = (req,res,next) =>{
    var delete_cookie = function(name)
     { document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'; };
  }

  exports.see_sections = (req,res,next) =>{
    id = req.userId;
  console.log(`ID = ${id}`)
    Instructor.findByPk(id)
    .then(instructor =>{
      if(!instructor)
      {
        const error = new Error('A instructor with this username could not be found.');
        error.statusCode = 401;
        throw error;
      }
        const instructor_class = instructor.classeNameClass;
      return Section.findAll({where :{classeNameClass : instructor_class}})
    })
    .then(sections =>{
        res.status(200).send(sections);
    })
    .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
};
exports.see_students = async (req,res,next) =>{

  let section_id = req.params.sectionID;
  Student.findAll({where : {sectionId :section_id}})
  .then(student =>{
    res.status(200).send(student);
  })
.catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};
exports.add_marks =async (req,res,next) =>{
  const students_array = req.body.students_array;
  const subject = req.body.subject;
  const out_of = req.body.out_of;
  let message;
  let i =0;
  let student_row;
  try {
    if(!students_array)
    {
      res.status(400).json({messag : 'thier is something wrong'});
    }
    while(students_array[i])
    {
      student_row = await Student.findByPk(students_array[i].id)
      message = "your son got a "+students_array[i].mark+" out of "+out_of+" in "+subject;
      student_row.createMark({
        message : message
      })
      student_row.save();
      i++;
    }
    res.status(200).json({
      message : 'it has been done'
    })
  }
  catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.add_note = (req,res,next) =>{
  const student_id = req.params.studentID;
  const message = req.body.message;
  const exp_date = req.body.exp_date;
  Student.findByPk(student_id)
  .then(student =>{
    student.createNote({
      message : message,
      exp_date : exp_date
    })
  })
  .then(() =>{
    res.status(200).json({
      message : 'note has been sent'
    })
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};
exports.check_attendance = async(req,res,next) =>{
  const students_array = req.body.students_array;
  let i =0;
  let student_row;
  try {
    if(!students_array)
    {
      res.status(400).json({messag : 'thier is something wrong'});
    }
    while(students_array[i])
    {
      student_row = await Student.findByPk(students_array[i].id)
      if(students_array[i].attend == true)
      {
        student_row.attend_number ++;
      }
      else
      {
        student_row.absence_number ++;
      }
      i++;
    }
    res.status(200).json({
      message : 'it has been done'
    })
  }
  catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


