const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Instructor = require('../models/instructor');
const Section = require('../models/section');
const Student = require('../models/student');
const StudentController = require('../controllers/student');
const Note = require('../models/note');
const SectionNote = require('../models/section-note');
const NoteIteam = require('../models/note-iteam');
const program = require('../models/program');
const FCM = require('fcm-node');
var server_key = require('../notification-fdc24-73b5f8816914.json');
const fcm = new FCM(server_key);
const { Op } = require("sequelize");

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
exports.see_students =async (req,res,next) =>{
  const section_id = req.params.sectionID;
  let section_row;
  let students_array = [];
  console.log(`ID Section : ${section_id}`);
      let student = await Student.findAll({where : {sectionId :section_id}});
      let i = 0;
      while(student[i]){
        section_row = await Section.findByPk(student[i].sectionId);
        element = {
          Sid:student[i].id,
          first_name:student[i].first_name,
          last_name:student[i].last_name,
          username : student[i].username,
          father_name:student[i].father_name,
          BirthDate : student[i].BirthDate,
          name_class : section_row.classeNameClass,
          name_sec : section_row.name_sec,
          password: student[i].password,
          rank : student[i].rank,
          age : student[i].age,
          attend_number : student[i].attend_number,
          absence_number : student[i].absence_number,
          tokenMessage : student[i].tokenMessage
        }
        students_array.push(element);
          i++;
      } 
        res.status(200).send(students_array);
    
    // .catch(err => {
    //     if (!err.statusCode) {
    //       err.statusCode = 500;
    //     }
    //     next(err);
      // });
  
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
exports.add_week_program =async (req,res,next)=>{
  const sectionId = req.body.sec_id;
  const arrayProgram = req.body.program;
  let week_program;
  if(!sectionId||!arrayProgram){
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  week_program =await Section.findOne({
      where:{
         id:sectionId
        }
      }
      ).catch(err=>{
        res.status(500).send(err);
      });
      let i = 0;
    while(arrayProgram[i]){
      week_program.createProgram({
        day:arrayProgram[i].day,
        first:arrayProgram[i].first,
        second:arrayProgram[i].second,
        third:arrayProgram[i].third,
        forth:arrayProgram[i].forth,
        fifth:arrayProgram[i].fifth,
        sixth:arrayProgram[i].sixth,
        seventh:arrayProgram[i].seventh
      }).catch(err=>{
        res.status(500).send(err); 
        return;
      });
      week_program.save();
      i++;
    }
    res.status(200).json({
      message : 'it has been done'
    })
}
exports.show_week_program = async (req,res,next)=>{
  const sec_id = req.body.sec_id;
  if(!sec_id){
    //error handling
    return
  }
array_weeks = await program.findAll({where : {
  sectionId : sec_id
}});
res.send(array_weeks);
}
exports.edit_week_program =async (req,res,next)=>{
  const sec_id = req.body.sec_id;
  const arrayProgram = req.body.program;
  let i = 0;
  while(arrayProgram[i]){
   program.update({
      first:arrayProgram[i].first,
      second:arrayProgram[i].second,
      third:arrayProgram[i].third,
      forth:arrayProgram[i].forth,
      fifth:arrayProgram[i].fifth,
      sixth:arrayProgram[i].sixth,
      seventh:arrayProgram[i].seventh
    },{
       where : {
         [Op.and]:[
           {
            day:arrayProgram[i].day,
            sectionId : sec_id
           }
         ] 
       }
    })
     .catch(err =>{
      next(err);
     });
     i++;
  }
  res.send(arrayProgram);
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
  const student_id = req.params.studentID;
  const message = req.body.message;
  let toToken;
  Student.findByPk(student_id)
  .then(student =>{
    toToken = student.tokenMessage;
    return student.createNote({
      message : message,
      start_date : Date.now()
    })
  })
  .then(() =>{
    // send notification
    var message = {
      to:toToken,
      notification:{
        title:'Note Private',
        body:'There is a note privat for you please check it'
      }
    };
    fcm.send(message,function(err,response){
      if(err){
        console.log("response : " + err);
      }else{
        console.log("Successfully sent with response : " , response);
      }
    });
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


