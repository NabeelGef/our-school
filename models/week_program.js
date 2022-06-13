const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Week_program = sequelize.define('week_program', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },  
    weekProgram: {
        type: Sequelize.BLOB,
        allowNull: false
      }
});



module.exports = Week_program;