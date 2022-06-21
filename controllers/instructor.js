const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Instructor = require('../models/instructor');
const Section = require('../models/section');
const Student = require('../models/student');
const StudentController = require('../controllers/student');
const Note = require('../models/note');
const SectionNote = require('../models/section-note');
const NoteIteam = require('../models/note-iteam');



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
           role : loadedUser.role,
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
exports.see_students = (req,res,next) =>{
  const section_id = req.params.sectionID;
  console.log(`ID Section : ${section_id}`);
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
exports.add_class_note = async(req,res,next) =>{
  const sections = req.body.sections;
  const title = req.body.title;
  const exp_date = req.body.exp_date;
  const message = req.body.message;
  var students,student;
  var qq;
  var SectionNotes;
  var i =0,j=0,f=0;
  while(sections[i])
  {
    SectionNotes = await SectionNote.create({ message : message, title : title,  exp_date : exp_date})
    console.log("================="+SectionNotes+"=====================")
    if(!SectionNotes)
    { 
      const error = new Error('thier is something wrong.');
      error.statusCode = 404;
      throw error;
     }
    students =  await Student.findAll({where : { sectionId : sections[i]}});
    if(!students)
    {
      const error = new Error('Could not find this students.');
      error.statusCode = 404;
      throw error;
    }
    j = 0;
    while(students[j])
    {
      student = students[j];
      qq =await student.addSectionnote(SectionNotes);
      j++;
    }
    i++;
  }
  res.status(200).json({
    message: 'note has been sent'
  })

};

exports.add_section_note = (req,res,next) =>{
  const setionID = req.params.sectionID;
  const title = req.body.title;
  const exp_date = req.body.exp_date;
  const message = req.body.message;
  var student;
  var temp_SectionNote;
  SectionNote.create({
    message : message,
    title : title,
    exp_date : exp_date
  })
  .then(SectionNotes =>{
    console.log(SectionNotes)


    if(!SectionNotes)
    {
      const error = new Error('thier is something wrong.');
      error.statusCode = 404;
      throw error;
    }
    temp_SectionNote = SectionNotes;
    return Student.findAll({where : { sectionId : setionID}});
  })
  .then(students =>{
    if(!students)
    {
      const error = new Error('Could not find this students.');
      error.statusCode = 404;
      throw error;
    }
    var i = 0;
    while(students[i])
    {
      student = students[i];
      console.log("=========")
      console.log(temp_SectionNote)
      console.log("=========")

      student.addSectionnote(temp_SectionNote);
      i++;
    }
  })
  .then(() =>{    
    res.status(200).json({
      message: 'note has been sent'
    })
  })
  .catch(err =>{
    if(!err.statusCode)
    {
      err.status = 500;
    }
    next(err);
  });
}

exports.add_marks =async (req,res,next) =>{
  const students_array = req.body.students_array;
  const subject = req.body.subject;
  const out_of = req.body.totalMark;
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
      result = StudentController.getRanking(out_of,students_array[i].mark);
  oldrank = await Student.findOne({
    where:{
      id:students_array[i].id
    }
  });
    result2 = oldrank.rank+result;
    Student.update({
      rank : result2
    },{
      where : {id : students_array[i].id}
    }
    );
  
      
      
      
      if(!student_row){
        res.status(400).send('Student is not found!!');
      }
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
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.add_note = (req,res,next) =>{
  const student_id = req.body.studentID;
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


