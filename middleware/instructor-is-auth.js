const jwt = require('jsonwebtoken');
const Instructor = require('../models/instructor');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  console.log(`Token : ${authHeader}`);
  
  if (!authHeader) {
    const error = new Error('Not authenticated1.');
    error.statusCode = 401;
    throw error;
  }
  
  const token =authHeader;
  let decodedToken ;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated2.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  console.log(`ID is :  ${req.userId}`);
  Instructor.findByPk(req.userId)
  .then(instructor =>{
    if(!instructor || instructor.role != 1 || instructor.username != decodedToken.username)
    {
      const error = new Error('Not authenticated3.');
      error.statusCode = 401;
      throw error;
    } 
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
  next();
};