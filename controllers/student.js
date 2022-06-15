const bcrypt = require('bcryptjs');
const { send } = require('express/lib/response');
const jwt = require('jsonwebtoken');
const PublicNote = require('../models/public-note');
const Section = require('../models/section');
const Student = require('../models/student');

exports.login = (req,res,next ) =>{
    const username = req.body.username;
    const password = req.body.password;
    let loadedStudenr;

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

    })
    .then (async isEqual =>{
        if(!isEqual)
        {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
              username: loadedStudenr.username,
              userId: loadedStudenr.id
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
          );
          section_row = await Section.findByPk(loadedStudenr.sectionId);
        res.status(200).json({id : loadedStudenr.id, 
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
                token : token    });       
    })
     .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.show_public_notes = (req,res,next) =>{
  PublicNote.findAll().then((publicnotes)=>{
    res.status(200).send(publicnotes);
    }).catch((err)=>{
      throw err;
  });
}
exports.show_private_notes = (req,res,next) =>{
 var Sid = req.get(Sid);
  Student.findByPk(1)
  .then(student =>{
    return student.getNotes();
  })
  .then(notes =>{
    res.status(200).json({
      notes : notes
    })
  })
  .catch(err => {
    if (!err.statusCode) {
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
 var excellent = finalResult;
 if(myResult<Bad){
  return -5;
 }else if (myResult<mid) {
  return 4;
 }else if (myResult<Good){
  return 6;
 }
 return 8; 
}