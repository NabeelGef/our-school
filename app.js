const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');


const sequelize = require('./util/database');
const Classe = require('./models/classe');
const Instructor = require('./models/instructor');
const Limpidityie = require('./models/limpidityie');
const Note = require('./models/note');
const Section = require('./models/section');
const Student = require('./models/student');
const Week_program = require('./models/week_program');
const PublicNote = require('./models/public-note');
const NotesIteam = require('./models/notes-iteam');
const app = express();


const adminRoutes = require('./routes/admin');
const instructorRoutes = require("./routes/instructor");
const studentRoutes = require("./routes/students");

app.use(bodyParser.json()); // application/json


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use('/admin',adminRoutes);
app.use('/instructor',instructorRoutes);
app.use(studentRoutes);


app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});







PublicNote.belongsToMany(Student, { through: NotesIteam });
Student.belongsToMany(PublicNote, { through: NotesIteam });



Student.hasOne(Limpidityie);
Limpidityie.belongsTo(Student);

Classe.hasOne(Instructor);
Instructor.belongsTo(Classe);


Section.hasOne(Week_program);
Week_program.belongsTo(Section);


Student.hasMany(Note);
Note.belongsTo(Student);

Section.hasMany(Student);
Student.belongsTo(Section);




Classe.hasMany(Section);
Section.belongsTo(Classe);




sequelize
  //.sync({ force: true })
  .sync()
  .then(result => {
   app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
