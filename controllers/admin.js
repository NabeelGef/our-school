const Instructor = require('../models/instructor');
const Section = require('../models/section');
const Student = require('../models/student');
const PublicNote = require('../models/public-note');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const note = require('../models/note');

exports.getAddInstructor = (req,res,next) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const username = req.body.username ;
  const password = req.body.password;
  const classe =  req.body.classeNameClass;
  Instructor.create({
    first_name : first_name,
    last_name : last_name,
    username : username,
    password : password,
    role : 1,
    classeNameClass : classe
  })
  .then(instructor =>{
    res.status(201).json({
    message: 'Instructor created successfully!',username : instructor.username, password : password
    });
  })
.catch(err => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
});
};


exports.updateInstructor = (req,res,next) => {
  const instructorID = req.params.instructorID;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const username = req.body.username ;
  const password = req.body.password;
  const classe =  req.body.classeNameClass;
  Instructor.findByPk(instructorID)
  .then(instructor =>{
    if (!instructor) {
      const error = new Error('Could not find this instructor.');
      error.statusCode = 404;
      throw error;
    }
    instructor.first_name = first_name;
    instructor.last_name = last_name;
    instructor.username = username;
    instructor.password = password;
    instructor.classeNameClass = classe;
    return instructor.save()
  }).then(result =>{
    console.log(`result : ${result}`);
    res.status(200).send(result)
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};



exports.deleteInstructor = (req,res,next) =>{
  const InstructorID = req.params.InstructorID;
  Instructor.findByPk(InstructorID)
  .then(instructor =>{
    if(!instructor)
    {
      const error = new Error('Could not find this instructor.');
      error.statusCode = 404;
      throw error;
    }
    instructor.destroy(); 
  })
  .then(() =>{
    res.status(200).json({messag : 'Instructor deleted successfully!'})
  })
  .catch( err =>{
    if(!err.statusCode)
    {
      err.statusCode = 500;
    }
    next(err);
  })
}

exports.ShowInstructors = (req,res,next) =>{

Instructor.findAll({where : {role : 1}})
.then(instructors =>{
  if(!instructors[0])
  {
    res.status(200).json({message : 'thier are not any instructors'})    
  }

  res.status(200).send(instructors)
})
.catch(err =>{
  if(!err.statusCode)
  {
    err.statusCode = 500;
  }
  next(err);
});
}

//------------------------------------------------------------------
exports.getAddStudent = (req,res,next) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  var section_id ;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const father_name = req.body.father_name ;
  const classe =  req.body.classeNameClass;
  const section = req.body.section;
  const BirthDate = req.body.BirthDate;
  const username = last_name;

  console.log(father_name+"----------"+classe)
  var min = 10000;
  var max = 99999;
  var password1 = Math.floor(Math.random() * (max - min + 1)) + min;
  var password = password1.toString();

  const age = Math.abs(new Date().getFullYear()- BirthDate.split('/')[2]);
  if(age < 0)
  {
  console.log("------------------------------------")

    const error = new Error('this birtherday cant be right');
    error.statusCode = 422;
    throw error;
  } 

  var today = new Date();
  var signInDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  console.log(`signInDate : ${signInDate}`);
  Section.findOne({where : {classeNameClass : classe ,name_sec : section }})
  .then(sectionclass =>{
    section_id = sectionclass.id;
    console.log(`sectionId : ${section_id}`);
   return Student.create({
          first_name : first_name,
          last_name : last_name,
          father_name : father_name,
          sectionId : section_id,
          BirthDate : BirthDate,
          age: age,
          attend_number: 0,
          absence_number: 0,
          signInDate : signInDate,
          username : username,
          password : password
        })
  })
  .then(() =>{
    res.status(201).json({
      message: 'Student created successfully!'
  });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
}

exports.updateStudent = (req,res,next) =>{
  console.log("--------------------------")
  const studentID = req.params.studentID;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  let section_id;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const father_name = req.body.father_name ;
  const classe =  req.body.classeNameClass;
  const section = req.body.section;
  const BirthDate = req.body.BirthDate;
  const password = req.body.password;
  console.log(first_name+""+last_name+""+father_name+""+classe+""+section+""+password+"//////"+BirthDate)
  Section.findOne({where : {classeNameClass : classe ,name_sec : section }})
  .then(sectionclass =>{
    section_id = sectionclass.id;
  }).then(()=>{
    return Student.findByPk(studentID);
  })
    .then(student =>{
    if (!student) {
      const error = new Error('Could not find this student.');
      error.statusCode = 404;
      throw error;
    }
    student.first_name = first_name;
    student.last_name = last_name;
    student.father_name = father_name;
    student.password = password;
    student.sectionId = section_id;
    if(BirthDate != student.BirthDate)
    {
      const age = Math.abs(new Date().getFullYear()- BirthDate.split('/')[2]); 
      student.BirthDate = BirthDate;
      student.age = age;
    }
    return student.save();
  })
  .then(result => {
    res.status(200).send(result)
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.deleteStudent = (req,res,next) =>{
  console.log("+++++++++++++++++++")

  const StudentID = req.params.StudentID;
  Student.findByPk(StudentID)
  .then(student =>{
    if(!student)
    {
      console.log("------------------")

      const error = new Error('Could not find this student.');
      error.statusCode = 404;
      throw error;
    }
    console.log("qqqqqqqqqqqqqq")
    student.destroy(); 
  })
  .then(() =>{
    res.status(200).json({messag : 'student deleted successfully!'})
  })
  .catch( err =>{
    if(!err.statusCode)
    {
      err.statusCode = 500;
    }
    next(err);
  })
}

exports.ShowStudents = async (req,res,next) =>{

  let i = 0;
  let section_row;
  let students_array = [ ];
  let element;
  try {
  const students = await Student.findAll();
  if(!students)
  {
    res.status(200).json({messag : 'thier are no studnets'});
  }
  while(students[i])
  {
      section_row =  await Section.findByPk(students[i].sectionId);
      element = {
        id : students[i].id,
        first_name : students[i].first_name,
        last_name : students[i].last_name,
        father_name : students[i].father_name,
        BirthDate : students[i].BirthDate,
        classeNameClass : section_row.classeNameClass,
        section :  section_row.name_sec,
        password : students[i].password
        
      }   
      students_array.push(element);
      i++;
  }
  res.status(200).send(students_array)
}
  catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};



//--------------------------------------------------------------------------

exports.addAnnouncement = (req,res,next) =>{
  const title = req.body.title;
  const message = req.body.message;
  const exp_date = req.body.exp_date;
  PublicNote.create({
    message : message,
    exp_date : exp_date,
    title : title
  })
  .then(() =>{
    res.status(201).json({
      message: 'announcement has been sent'
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



exports.updateAnnouncement = (req,res,next) =>{
  const announcementID = req.params.AnnouncementID;
  const announcement = req.body.message;
  const exp_date = req.body.exp_date;
  const title = req.body.title
  PublicNote.findByPk(announcementID)
  .then(publicnote =>{
    if (!publicnote) {
      const error = new Error('Could not find this publicnote.');
      error.statusCode = 404;
      throw error;
    }
    publicnote.message = announcement;
    publicnote.exp_date = exp_date;
    publicnote.title = title;
    return publicnote.save();
  }).then(result =>{
    res.status(200).json({messag : 'announcement updated!',announcement : result})
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });

}

exports.deleteAnnouncement = (req,res,next) =>{
  
  const announcementID = req.params.AnnouncementID;
  PublicNote.findByPk(announcementID)
  .then(publicnote =>{
    if (!publicnote) {
      const error = new Error('Could not find this publicnote.');
      error.statusCode = 404;
      throw error;
    }
    publicnote.destroy();
  })
  .then(() =>{
    res.status(200).json({messag : 'publicnote deleted successfully!'})
  })
  .catch( err =>{
    if(!err.statusCode)
    {
      err.statusCode = 500;
    }
    next(err);
  })
}



exports.ShowAnnouncements = (req,res,next) =>{
  PublicNote.findAll()
  .then(publicnotes =>{
    if(!publicnotes[0])
    {
      res.status(200).json({message : 'thier is no note'})
    }
    res.status(200).send(publicnotes)
  })
  .catch(err =>{
    if(!err.statusCode)
    {
      err.statusCode = 500;
    }
    next(err);
  });
}


exports.getAnnouncement = (req,res,next) =>{
  const announcementID = req.params.AnnouncementID;
  PublicNote.findByPk(announcementID)
  .then(publicnote =>{
    if(!publicnote)
    {
      res.status(200).json({messag : 'thier arent any publicnote'});
    }
    res.status(200).json({publicnote : publicnote});
  })
  .catch(err =>{
    if(!err.statusCode)
    {
      err.statusCode = 500;
    }
    next(err);
  });
}



