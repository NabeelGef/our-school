const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const program = sequelize.define('program', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      day:{
        type:Sequelize.STRING,
        allowNull:false
      },
      first:{
        type:Sequelize.STRING
      },
      second:{
        type:Sequelize.STRING
      },
      third:{
        type:Sequelize.STRING
      },
      forth:{
        type:Sequelize.STRING
      },
      fifth:{
        type:Sequelize.STRING
      },
      sixth:{
        type:Sequelize.STRING
      },
      seventh:{
        type:Sequelize.STRING
      }  
});



module.exports = program;