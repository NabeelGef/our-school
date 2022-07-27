 const { send } = require('express/lib/response');
const jwt = require('jsonwebtoken');
const PublicNote = require('../models/public-note');
const Section = require('../models/section');
const Student = require('../models/student');
const SectionNote = require('../models/section-note');
const Instructor = require('../models/instructor');
const Complaint = require('../models/complaint');
const program = require('../models/program');
const FCM = require('../util/notification');
const fcm = FCM.fcm;
const e = require('express');

exports.send_Complaint = (req,res,next)=>{
  const Sid = req.userId;
  const message = req.body.message;
  let toToken , ins_Id;
  Student.findByPk(Sid).
  then(async student =>{
    let section_id = student.sectionId;
    let classname = await Section.findOne({where : {
      id:section_id
    }});
    Instructor.findOne({where : {
      classeNameClass:classname.classeNameClass
    }}).then(Ins_Info =>{
      toToken = Ins_Info.tokenMessage;
      ins_Id = Ins_Info.id;
      console.log(`ID INS : ${ins_Id}`);
      var message2 = {
        to:toToken,
        notification:{
          title:'Complaint',
          body: 'There is a message complaint for you please check it'
        }
      };
      fcm.send(message2,function(err,response){
        if(err){
          console.log("response : " + err);
        }else{
          console.log("Successfully sent with response : " , response);
        }
        Complaint.create({
          Sid : Sid,
          Ins_id : ins_Id,
          message : message,
          start_date : Date.now()
        }).catch(err =>{
          throw err;
        });
      });
    })
     }).catch(err =>{
      throw err;
    })
      // send notification
  res.status(200).send("it has been done ")
}

exports.login = (req,res,next ) =>{
    const username = req.body.username;
    const password = req.body.password;
    const tokenMessage = req.body.tokenMessage;
    console.log(`TokenMessage : ${tokenMessage}`);
    let loadedStudenr;
    let token ;
    Student.findAll({where :{username : username}})
    .then(students =>{
        if(!students)
        {
            const error = new Error('A studnet with this username could not be found.');
            error.statusCode = 401;
            throw error;
          
        }
        let i =0;
        while(students[i])
        {

          if(students[i].password == password)
          {
            loadedStudenr = students[i];
            return true;
          }
          i++;
        }
        return false;

    }).then (async isEqual =>{
        if(!isEqual)
        {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        token = jwt.sign(
            {
              username: loadedStudenr.username,
              userId: loadedStudenr.id
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
          );
          Student.update({
            tokenMessage : tokenMessage
          },{
            where :{} 
          });
          section_row = await Section.findByPk(loadedStudenr.sectionId);
          AllData = {
            id : loadedStudenr.id, 
            first_name: loadedStudenr.first_name,
            last_name : loadedStudenr.last_name,
            age : loadedStudenr.age,
            father_name : loadedStudenr.father_name,
            username : loadedStudenr.username,
            password : loadedStudenr.password ,
            signInDate : loadedStudenr.signInDate ,
            BirthDate : loadedStudenr.BirthDate,
            attend_number : loadedStudenr.attend_number,
            absence_number : loadedStudenr.absence_number,
            class : section_row.classeNameClass,
            name_sec : section_row.name_sec,
            sectionId : loadedStudenr.sectionId,
            token : token,
            tokenMessage:tokenMessage
          }
          res.status(200).send(AllData);
         }).catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });       
};
exports.show_public_notes = (req,res,next) =>{
  const student_id = req.userId;
  console.log(`The Id Is : ${student_id}`)
  let i = 0 ;  
PublicNote.findAll().then((publicnotes)=>{
  Student.findByPk(student_id)
  .then(student =>{
    return student.getSectionnotes();
  })
  .then(notes =>{
       if(!notes){
        res.status(404).json({messag : 'Not Found any notes!!'});
       }
while(notes[i]){
element = {
  id:notes[i].id,
  title : notes[i].title,
  message : notes[i].message,
  exp_date : notes[i].exp_date   
}
publicnotes.push(element);
i++;
}
res.status(200).send(publicnotes);
  }).catch((err)=>{
    throw err;
});
  }).catch(err => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
})

}
exports.show_private_notes = (req,res,next) =>{
 var Sid = req.userId;
  Student.findByPk(Sid)
  .then(student =>{
    return student.getNotes();
  })
  .then(notes =>{
    res.status(200).send(notes);
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}
exports.show_marks = (req,res,next) =>{
   const Sid = req.userId;
   Student.findByPk(Sid)
   .then(student =>{
    return student.getMarks();
   }).then(marks =>{
    res.status(200).send(marks);
   }).catch(err =>{
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
   }); 
}
exports.getRanking = function(finalResult , myResult){
 var Bad = finalResult/2;
 var limit = (finalResult-Bad)/3;
 var Mod = (finalResult-Bad)%3;
 var mid = Bad + limit;
 if(Mod!=0){
  mid++;
 }
 var Good = mid+limit;
 if(Mod===2){
  Good++
 }
 if(myResult<Bad){
  return -5;
 }else if (myResult<mid) {
  return 4;
 }else if (myResult<Good){
  return 6;
 }
 return 8; 
}

exports.show_week_program = async (req,res,next)=>{
  const sec_id = req.params.section;
  if(!sec_id){
    //error handling
    return
  }
array_weeks = await program.findAll({where : {
  sectionId : sec_id
}});
res.send(array_weeks);
};

// exports.show_sections_notes = (req,res,next) =>{
//   const student_id = req.userId;
//   let notes_array = [ ];
//   let i = 0 ;
//   console.log(`ID Student : ${student_id}`);
//   Student.findByPk(student_id)
//   .then(student =>{
//     return student.getSectionnotes();
//   })
//   .then(notes =>{

//        if(!notes){
//         res.status(404).json({messag : 'Not Found any notes!!'});
//        }
// while(notes[i]){

// element = {
//   id:notes[i].id,
//   title : notes[i].title,
//   message : notes[i].message,
//   exp_date : notes[i].exp_date   
// }
// notes_array.push(element);
// i++;
// }
//     res.status(200).send(notes_array);
//   })
//   .catch(err => {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   })
//}