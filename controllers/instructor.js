const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Instructor = require('../models/instructor');
const Section = require('../models/section');
const Student = require('../models/student');
const StudentController = require('../controllers/student');
const SectionNote = require('../models/section-note');
const program = require('../models/program');
const Complaint = require('../models/complaint');
const FCM = require('../util/notification');
const fcm = FCM.fcm;
const Abscese = require('../models/abscese');
const { Op } = require("sequelize");
const { validationResult } = require('express-validator/check');





exports.login = (req,res,next ) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const username = req.body.username;
    const password = req.body.password;
    const tokenMessage = req.body.tokenMessage;
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

        loadedUser.tokenMessage = tokenMessage;
        loadedUser.save();
        res.status(200).json({
           token: token,
           tokenMessage : tokenMessage,
           first_name : loadedUser.first_name,
           last_name:loadedUser.last_name,
           username : loadedUser.username,
           id:loadedUser.id,
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



exports.logout = (req,res,next) =>{
    var delete_cookie = function(name)
     { document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'; };
};


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
};


exports.add_week_program =async (req,res,next)=>{
  const sectionId = req.params.sectionID;
  const arrayProgram = req.body.program;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  let week_program;
  try 
  {
    week_program =await Section.findOne({
        where:{
          id:sectionId
          }})
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
        })
        i++;
    }
    res.status(200).json({
      message : 'it has been done'
    })  
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }    
}


exports.show_week_program = async (req,res,next)=>{
  const sectionID = req.params.sectionID;
  try
  {
    array_weeks = await program.findAll({where : {
      sectionId : sectionID
    }});
    if(!array_weeks)
    {
      const error = new Error('Could not find this program.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).send(array_weeks);
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }    
}


exports.update_week_program =async (req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const sectionID = req.body.sectionID;

  try
  {
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
              sectionId : sectionID
             }
           ] 
         }
      })
       i++;
    }
    res.send(arrayProgram);
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


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
        message : message,
        start_date : Date.now()
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

// exports.see_student_in_class = async(req,res,next) =>{
//   const section_id = req.params.sectionID;
//   Student.findAll({where : {sectionId :section_id}})
//   .then(student =>{
//     if(!student)
//     {
//       const error = new Error('this student is not exist.');
//       error.statusCode = 404;
//       throw error;
//     }
//     res.status(200).send(student)
//   })
//   .catch(error)
//   {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };






exports.check_attendance = async(req,res,next) =>{
  const students_array = req.body.students_array;
  let i =0;
  let student_row;
  try {
    if(!students_array)
    {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    while(students_array[i])
    {
      
      student_row = await Student.findByPk(students_array[i].id)
      if(students_array[i].absence == true)
      {
        var today = new Date();
        student_row.createAbscese({
          message : "your son is absent from school today",
          exp_date : today.getDay()+20,
          start_date : Date.now()
        })
        student_row.rank-=2;
        student_row.absence_number ++;
      }
      else
      {
        student_row.attend_number ++;
      }
      student_row.save();
      i++;
    }
    res.status(200).json({
      message : 'it has been done'
    })
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.getComplaint =async (req,res,next)=>{
  const userId = req.userId;
  try{
  let alldata = await Complaint.findAll({where : {
    instructorId : userId
  }});
     let i = 0 ;
     let DATAArray = [];
     while(alldata[i]){
      let student_info = await Student.findOne({where:{id : alldata[i].studentId}})
      let name = student_info.first_name + student_info.last_name;
        let data = {
          message : alldata[i].message,
          start_date: alldata[i].start_date,
          username:name
        }
        DATAArray.push(data);
       i++;
     }
     res.send(DATAArray);
    }catch(err){
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }     
};

exports.addAbcenseNote = (req,res,next)=>{
  const studentId = req.params.studentID;
  const message = req.body.message;
  let toToken;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  Student.findByPk(studentId)
  .then(student =>{
    toToken = student.tokenMessage;
    student.createAbscese({
      message:message,
      exp_date : (Date.now()+20),
      start_date : Date.now()
    }).then((result)=>{
      var message2 = {
        to:toToken,
        notification:{
          title:'Absence warning',
          body: 'There is a Absence Warning for you please check it'
        }
      };
      fcm.send(message2,function(err,response){
        if(err){
          console.log("response : " + err);
        }else{
          console.log("Successfully sent with response : " , response);
        }
      });
      res.status(201).send('Abcense note has been sent');
  }).catch(err=>{
     next(err);
  })
}).catch(err =>{
  next(err)
});
};
exports.add_limpidityie = (req,res,next) =>{
  const studentID = req.params.studentID;
  let temp_student;
  Student.findByPk(studentID)
  .then(student =>{
    if(!student)
    {
      const error = new Error('Could not find this student.');
      error.statusCode = 404;
      throw error;
    }
    temp_student = student;
    if(req.file)
    {
      if(req.file.filename){
        destination= req.file.destination.split('./public');
        return limpidityie = 'http://192.168.138.8:3000' + destination[1]+'/'+req.file.filename;
        }
    }
  })
  .then(limpidityie =>{
    temp_student.createLimpidityie({
      limpidityies:limpidityie
    })
  })
  .then(() =>{
    res.status(201).json({message : "the Limpidityie has been created"})
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

