const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Week_program = sequelize.define('week_program', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },  
});



module.exports = Week_program;